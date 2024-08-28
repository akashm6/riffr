from flask import Flask, request, redirect, session, jsonify
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv
from datetime import datetime
from flask_cors import CORS
import requests
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

@app.route('/')
def login():
    authorization_url = sp_oauth.get_authorize_url()
    return redirect(authorization_url)

@app.route('/callback')
def callback():
    code = request.args.get('code')
    token_info = sp_oauth.get_access_token(code)
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
            'name': item['name'],
            'image': item['images'][0]['url'] if item['images'] else None,
            'url': item['external_urls']['spotify'],
            'followers': f"{item['followers']['total']:,}",
            'genres': [genre.capitalize() for genre in item['genres']] 
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
    data = data['_embedded']['events']
    results = []
    concert_title = ''
    for event in data:
        #print(event)
        ticket_url = event['url']
        name = event['name']
        date = str(parse_date(event['dates']['start']['localDate']))
        date = date[:date.index(' ')]
        time = event['dates']['start']['localTime']
        venue = event['_embedded']['venues'][0]['name']
        city = event['_embedded']['venues'][0]['city']['name']
        address = f"{event['_embedded']['venues'][0]['address']['line1']}, {city},{country_code}"
        results.append({
            'title': name,
            'artist_name': artist_name,
            'venue_name': venue,
            'address': address,
            'city': city,
            'date': date,
            'time': time,
            'ticket_link': ticket_url
        })
    return jsonify(results)

@app.route('/available-countries', methods = ['GET'])
def get_available_countries():
    keyword = request.args.get('artistName')
    available = []
    with open('./country_codes.csv', newline='') as file:
        reader = csv.DictReader(file)
        country_data = [row for row in reader]
    for country in country_data:
        url = f"https://app.ticketmaster.com/discovery/v2/events.json?size=10&keyword={keyword}&countryCode={country['country_code']}&apikey={ticketmaster_token}"
        try:
            response = requests.get(url)
            data = response.json()
            ticket_link = data['_embedded']
            available.append(country['country_code'])
        except:
            continue
    return jsonify(available)

def parse_date(date):
    date = datetime.fromisoformat(date.replace("Z", "+00:00"))
    formatted_date = date.strftime("%m/%d/%Y %I:%M %p")
    return formatted_date

if __name__ == '__main__':
    app.run(debug=True)
