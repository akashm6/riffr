from flask import Flask, request, redirect, session, jsonify
from flask_cors import CORS
from spotipy.oauth2 import SpotifyOAuth
import spotipy
import pathlib
import os
from dotenv import load_dotenv
import requests
from datetime import datetime
 
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

predict_hq_token = os.environ.get('PREDICT_HQ_API_TOKEN')

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
    artist_name = request.args.get('artist_name')
    if not artist_name:
        return jsonify({'error': 'Artist name is required'}), 400

    url = f'https://api.predicthq.com/v1/events/?q={artist_name}&category=concerts'
    headers = {
        'Authorization': f'Bearer {predict_hq_token}',
    }

   
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    data = response.json()
    results = []
    concert_title = ''
    for item in data['results']:
        for title in item['alternate_titles']:
            if 'tour' in title.lower():
                concert_title = title
        concert_title = format_title(concert_title) if concert_title else format_title(item['alternate_titles'][0])
        results.append({
            'title': concert_title,
            'venue_name': item['entities'][0]['name'],
            'address': item['entities'][0]['formatted_address'],
            'date': parse_date(item['start_local'])
        })

    return jsonify(results)

def parse_date(date):
    date = datetime.fromisoformat(date.replace("Z", "+00:00"))
    formatted_date = date.strftime("%m/%d/%Y %I:%M %p")
    return formatted_date

def format_title(title):
    formatted = ''
    for letter in title:
        if letter.isalnum() or letter == ' ':
            formatted += letter
    return formatted

if __name__ == '__main__':
    app.run(debug=True)

