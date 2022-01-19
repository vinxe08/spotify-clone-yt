import {  signOut, useSession } from 'next-auth/react'
import { ChevronDownIcon, ArrowSmRightIcon } from "@heroicons/react/outline"
import { useEffect, useState } from 'react'
import { shuffle } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, playlistState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';
import Recommended from './Recommended';
import { RecommendedId } from '../atoms/RecommendedAtom';

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

function Center() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null)
  const playlistId = useRecoilValue(playlistIdState) // Recoil: Holds Value default id 
  const [playlist, setPlaylist] = useRecoilState(playlistState) // Recoil: Holds Spotify Data
  const [openModal, setOpenModal] = useState(false)
  const [recommendedId, setRecommendedId] = useRecoilState(RecommendedId)

  useEffect(() => {
    setColor(shuffle(colors).pop())
  }, [playlistId])

  useEffect(() => {
    // From useSpotify function, Repository: https://github.com/thelinmichael/spotify-web-api-node
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body) // data.body: Data in spotify that will send in Recoil 
        setRecommendedId(data.body.tracks.items?.[0].track.artists?.[0].id)
      }).catch(err => console.log("Something went wrong!", err))
  }, [spotifyApi, playlistId])

  return (
    <div className='flex-grow h-screen overflow-y-scroll scrollbar-hide'>
      <header className='absolute top-5 right-5'>
        <div 
          className="flex items-center bg-black text-white space-x-3 opacity-80 hover:opacity-90 cursor-pointer rounded-full p-1 pr-2"
          onClick={() => setOpenModal(!openModal)}>
          <img 
            className="rounded-full w=7 h-7"
            src={session?.user.image} 
            alt="" />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className={openModal ? 'h-5 w-5 rotate-180' : 'h-5 w-5 rotate-0'}/>
        </div>
        {openModal && 
          <div className='absolute top-11 right-0 bg-[#2E2D2D] w-[13rem] opacity-100 rounded-md p-[.25rem]'>
            <div className='menu_bar'>
              <h1 className='text-[14px] font-medium'>Account</h1>
              <ArrowSmRightIcon className='h-5 w-5 ml-auto -rotate-45' />
            </div>
            <div className='menu_bar'>
              <h1 className='text-[14px] font-medium'>Profile</h1>
            </div>
            <div className='menu_bar'>
              <h1 className='text-[14px] font-medium'>Upgrade to Premium</h1>
              <ArrowSmRightIcon className='h-5 w-5 ml-auto -rotate-45' />
            </div>
            <div 
              className='menu_bar'
              onClick={signOut} >
              <h1 className='text-[14px] font-medium'>Log out</h1>
            </div>
          </div>
        }
      </header>
      <section className={`flex flex-col  bg-gradient-to-b to-[#1f1d1dc2] ${color} h-100 text-white`}>
      {/* <section className="flex items-end space-x-7 h-[21rem] text-white p-8 pb-6"> */}
        <div className='flex p-6 pl-8 space-x-7 items-end'>
          <img 
            className='h-[14.5rem] w-[14.5rem] shadow-2xl mt-[3.8rem]'
            src={playlist?.images?.[0].url} 
            alt="" />
          <div className=''>
            <p className='text-xs font-bold'>PLAYLIST</p>
            <h1 className='text-2xl md:text-3xl xl:text-8xl font-bold tracking-tighter'>{playlist?.name}</h1>
          </div>
        </div>
        <div className='bg-[#1212123a]'>
          <Songs />
        </div>
      </section>
      <div>  
        <Recommended recommendedId={recommendedId} />
      </div>
    </div>
  )
}

export default Center
