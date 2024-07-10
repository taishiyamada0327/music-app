import axios from 'axios';

class SpotifyClient {
  static async initialize() {
    const res = await axios.post(
      'https://accounts.spotify.com/api/token',
      {
        grant_type: 'client_credentials',
        client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
        client_secret: process.env.REACT_APP_SPOTIFY_SECRET_CLIENT,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    let spotify = new SpotifyClient();
    spotify.token = res.data.access_token;
    return spotify;
  }

  async getPopularSongs() {
    const res = await axios.get(
      'https://api.spotify.com/v1/playlists/37i9dQZF1DX9vYRBO9gjDe/tracks',
      {
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      }
    );
    return res.data;
  }
}

const spotify = await SpotifyClient.initialize();
export default spotify;
