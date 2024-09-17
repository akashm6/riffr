from flask import Flask, request, redirect, session, jsonify
from spotipy.oauth2 import SpotifyOAuth
from psycopg2.extras import Json
from dotenv import load_dotenv
from datetime import datetime
from flask_cors import CORS
import requests
import psycopg2
import spotipy
import pathlib
import csv
import os

path = pathlib.Path('src') / '.env'
load_dotenv(dotenv_path=path)

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = os.environ.get('SECRET_KEY')

sp_oauth = SpotifyOAuth(
    client_id=os.environ.get('SPOTIPY_CLIENT_ID'),
    client_secret= os.environ.get('SPOTIPY_CLIENT_SECRET'),
    redirect_uri= os.environ.get('SPOTIPY_REDIRECT_URI'),
    scope="user-library-read user-top-read user-read-playback-state user-read-currently-playing user-read-recently-played"
)

ticketmaster_token = os.environ.get('TICKETMASTER_CONSUMER_KEY')
maps_api_key = os.environ.get('GOOGLE_MAPS_API_KEY')

country_codes_to_names = {}

def get_db_connection():
    conn = psycopg2.connect(
        dbname=os.environ.get('DB_NAME'),
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASSWORD'),
        host=os.environ.get('DB_HOST')
    )
    return conn

@app.route('/create-tables')
def create_tables():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS artist_countries (
            artist_name VARCHAR(255) PRIMARY KEY,
            countries JSONB,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ''')
    conn.commit()
    cur.close()
    conn.close()
    return "Tables created successfully"

def cache_countries(artist_name, countries):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO artist_countries (artist_name, countries) 
        VALUES (%s, %s)
        ON CONFLICT (artist_name) 
        DO UPDATE SET countries = EXCLUDED.countries, last_updated = CURRENT_TIMESTAMP
        """,
        (artist_name, Json(countries))  
    )
    conn.commit()
    cur.close()
    conn.close()

def get_cached_countries(artist_name):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT countries FROM artist_countries WHERE artist_name = %s", (artist_name,))
    result = cur.fetchone()
    cur.close()
    conn.close()
    if result is not None:
        return result[0] 
    return None 


@app.route('/available-countries', methods=['GET'])
def get_available_countries():
    if not country_codes_to_names:
        load_country_codes()

    artist_name = request.args.get('artistName')

    cached_countries = get_cached_countries(artist_name)
    if cached_countries is not None:
        return jsonify(cached_countries) 

    available = []
    for country_code in country_codes_to_names:
        url = f"https://app.ticketmaster.com/discovery/v2/events.json?size=10&keyword={artist_name}&countryCode={country_code}&apikey={ticketmaster_token}"
        try:
            response = requests.get(url)
            data = response.json()
            if '_embedded' in data:
                available.append({
                    'country_code': country_code,
                    'country_name': country_codes_to_names.get(country_code)
                })
        except:
            continue

    if not available:
        cache_countries(artist_name, {'no_concerts': True})
        return jsonify({'no_concerts': True}) 

    cache_countries(artist_name, available)

    return jsonify(available)


@app.route('/')
def login(): 
    if os.path.exists('./.cache'):
        os.remove('./.cache')
    authorization_url = sp_oauth.get_authorize_url()
    session['token_info'] = sp_oauth.get_cached_token()
    return redirect(authorization_url)

@app.route('/callback')
def callback():
    token_info = sp_oauth.get_access_token(request.args['code'])
    session.clear()
    session["token_info"] = token_info
    return redirect('http://localhost:3000/num_artists')


@app.route('/top_artists')
def fetch_top_artists():
    num_artists = request.args.get('num_artists', default=10, type=int)
    token_info = session.get("token_info", None)

    if not token_info:
        return redirect('/')

    sp = spotipy.Spotify(auth=token_info['access_token'])
    results = sp.current_user_top_artists(limit=num_artists)

    artists = []
    for item in results['items']:
        artists.append({
            'name': item.get('name'),
            'image': item.get('images')[0].get('url') if item.get('images') else None,
            'url': item.get('external_urls').get('spotify'),
            'followers': f"{item.get('followers').get('total'):,}",
            'genres': [genre.capitalize() for genre in item.get('genres')] 
        })

    return jsonify(artists)

@app.route('/concerts', methods=['GET'])
def fetch_concerts():
    artist_name = request.args.get('artistName')
    country_code = request.args.get('country')
    if not artist_name:
        return jsonify({'error': 'Artist name is required'}), 400

    url = f"https://app.ticketmaster.com/discovery/v2/events.json?size=10&keyword={artist_name}&countryCode={country_code}&apikey={ticketmaster_token}"

    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    data = data.get('_embedded').get('events')
    results = []
    for event in data:
        ticket_url = event.get('url')
        name = event.get('name')
        date = str(parse_date(event.get('dates').get('start').get('localDate')))
        date = date[:date.index(' ')]
        time = str(parse_time(event.get('dates').get('start').get('localTime')))
        venue = event.get('_embedded').get('venues')[0].get('name')
        city = event.get('_embedded').get('venues')[0].get('city').get('name')
        address = f"{event.get('_embedded').get('venues')[0].get('address').get('line1')}, {city},{country_code}"
        results.append({
            'title': name,
            'artist_name': artist_name,
            'venue_name': venue,
            'address': address,
            'city': city,
            'date': date,
            'time': time,
            'ticket_link': ticket_url,
            'maps_key': maps_api_key
        })
    return jsonify(results)

def load_country_codes():
    global country_codes_to_names
    with open('./country_codes.csv', newline = '') as file:
        reader = csv.DictReader(file)
        country_codes_to_names = {row['country_code']: row['country_name'] for row in reader}

def parse_date(date):
    date = datetime.fromisoformat(date.replace("Z", "+00:00"))
    formatted_date = date.strftime("%m/%d/%Y %I:%M %p")
    return formatted_date

def parse_time(time):
    time_object = datetime.strptime(time,'%H:%M:%S')
    formatted_time = time_object.strftime("%I:%M %p")
    return formatted_time

if __name__ == '__main__':
    app.run(debug=True)
