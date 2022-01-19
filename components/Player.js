import { HeartIcon, VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import { RewindIcon, FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon, VolumeUpIcon, SwitchHorizontalIcon } from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify"

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentIdTrack] = useRecoilState(currentTrackIdState)

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

// Fetch song info from Spotify API
  const fetchCurrentSong = () => {
    if (!songInfo) {
      // Get the current playing song
      spotifyApi.getMyCurrentPlayingTrack().then(data => {
        // Set this ID into currentTrackIdState(RECOIL)
        setCurrentIdTrack(data.body?.item?.id);

        // Get the current playback state ||  is_playing ? (True or False)
        spotifyApi.getMyCurrentPlaybackState().then(data => {
          setIsPlaying(data.body?.is_playing);
        })
      })
    }
  }

  // Handles Play & Pause function
  const handlePlayPause = () => {
    // Get the current playback state ||  is_playing ? (True or False)
    spotifyApi.getMyCurrentPlaybackState().then(data => {
      if (data.body.is_playing) {
        spotifyApi.pause(); // from spotify web api node function
        setIsPlaying(false)
      } else {
        spotifyApi.play()// from spotify web api node function
        setIsPlaying(true)
      }
    })
  }

  // Volume Function
  const debounceAdjustVolume = useCallback(
    debounce(() => {
      spotifyApi.setVolume(volume).catch(err => {console.log(err);});
    }, 500), 
    []
  )

  // Handles the Current Playing Track function
  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      // Fetch the song info
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackIdState, spotifyApi, session])

  useEffect(() => {
    if(volume > 0 && volume < 100) {
      debounceAdjustVolume(volume)
    }
  },[volume])

  return (
    <div className="h-[5.7rem] bg-[#212121] text-white grid grid-cols-3 text-xs md:text-base px-4 ">

      <div className="flex items-center space-x-4">
        <img 
          className="hidden md:inline h-15 w-14" 
          src={songInfo?.album.images?.[0].url} alt="" />
          <div>
            <h3 className="text-sm cursor-pointer hover:underline">{songInfo?.name}</h3>
            <p className="text-xs text-gray-400 cursor-pointer hover:underline">{songInfo?.artists?.[0]?.name}</p>
          </div>
      </div>

      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className='button'/>
        <RewindIcon 
          // onClick={() => spotifyApi.skipToPrevious()} - The API is not working
          className='button'/>

        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10"/>
        ): (
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
        )}
        <FastForwardIcon 
          // onClick={() => spotifyApi.skipToNext()} - The API is not working
          className="button"/>
        <ReplyIcon className="button" />
      </div>

      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)} 
          className="button" />
        <input 
          className=" w-14 md:w-28 h-1 rounded-lg "
          type="range" 
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0} 
          max={100} />
        <VolumeUpIcon 
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button" />
      </div>
    </div>
  )
}

export default Player
