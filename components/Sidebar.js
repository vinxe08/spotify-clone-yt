import { HomeIcon, SearchIcon, LibraryIcon, PlusCircleIcon, HeartIcon, RssIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { playlistIdState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify'; // Hooks

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession()
  const [ playlists, setPlaylists ] = useState([]) 
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState) // Recoil: State

  useEffect(() => {
    if(spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
        setPlaylistId(data.body.items?.[0].id)
      });
    }
  }, [session, spotifyApi])

  return (
    <div className='text-gray-400 p-6 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen w-[15.05rem] hidden md:inline-flex '>
      <div className='space-y-4'>
        <div className='flex items-center space-x-2 pb-[1.1rem] cursor-pointer'>
          <img src="https://links.papareact.com/9xl" alt="" className='w-[40px]' />
          <div className='flex items-center'>
            <h1 className='text-white text-[1.6rem] font-semibold tracking-tighter'>Spotify</h1>
            ®
          </div>
        </div>
        <button className='flex items-center space-x-4 hover:text-white'>
          <HomeIcon className='h-7 w-7' />
          <p>Home</p>
        </button>
        <button className='flex items-center space-x-4 hover:text-white'>
          <SearchIcon className='h-7 w-7' />
          <p>Search</p>
        </button>
        <button className='flex items-center space-x-4 hover:text-white'>
          <LibraryIcon className='h-7 w-7' />
          <p>Your Library</p>
        </button>
        <hr className='border-t-[0.1px] border-gray-900'/>

        <button className='flex items-center space-x-4 hover:text-white'>
          <PlusCircleIcon className='h-7 w-7' />
          <p>Create Playlist</p>
        </button>
        <button className='flex items-center space-x-4 hover:text-white'>
          <HeartIcon className='h-7 w-7' />
          <p>Liked Songs</p>
        </button>
        <button className='flex items-center space-x-4 hover:text-white'>
          <RssIcon className='h-7 w-7' />
          <p>Your episodes</p>
        </button>
        <hr className='border-t-[0.1px] border-gray-900'/>

        {playlists.map((playlist) => (
          <p 
            key={playlist.id}
            onClick={() => setPlaylistId(playlist.id)} // Use to change Tracks according to its own spotify ID 
            className='cursor-pointer hover:text-white'
            >
              {playlist.name}
            </p>
        ))
        }
      </div>
    </div>
  )
}

export default Sidebar
