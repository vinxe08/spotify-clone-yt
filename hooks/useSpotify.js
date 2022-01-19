import { useSession, signIn } from "next-auth/react"
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";  //GitHub Repo: https://github.com/thelinmichael/spotify-web-api-node

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

function useSpotify() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if(session) {
      // If refresh access token attemp fails, direct user to login...
      if(session.error === 'RefreshAccessTokenError'){
        signIn()
      }

      spotifyApi.setAccessToken(session.user.accessToken)
    }
    
  }, [session])

  return spotifyApi;
}

export default useSpotify
