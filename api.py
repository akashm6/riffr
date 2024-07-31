from flask import Flask, request, redirect, session
from flask_cors import CORS
from spotipy.oauth2 import SpotifyOAuth

app = Flask(__name__)
CORS(app)
app.secret_key = 'Digitalsmo12#'

sp = SpotifyOAuth(
    client_id="d9fa0a5b61b148d1810d4a558d30d77b",
    client_secret="bfcd506b3eab4e24846ac2793d125d96",
    redirect_uri="http://localhost:5000/callback",  
    scope="user-library-read"
)

@app.route('/')
def login():
    authorization_url = sp.get_authorize_url()
    print(authorization_url)
    return redirect(authorization_url)


@app.route('/callback')
def callback():
    code = request.args.get('code')
    print(code)
    token_info = sp.get_access_token(code)
    session["token_info"] = token_info
    print(token_info)
    return redirect('http://localhost:3000/tracker')

if __name__ == '__main__':
    app.run(debug = True)
