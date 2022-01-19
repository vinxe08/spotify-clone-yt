import { useRecoilValue } from "recoil"
import { playlistState } from "../atoms/playlistAtom"
import Song from "./Song";
import { PlayIcon } from '@heroicons/react/solid'
import { DotsHorizontalIcon } from '@heroicons/react/solid'

function Songs() {
  const playlist = useRecoilValue(playlistState)

  return (
    <div className="text-white px-8 flex-col space-y-1  pt-10 relative">
      <div className="flex">
        <div className="h-[32px] w-[32px] bg-white ml-2 mb-10"></div>
        <PlayIcon className="w-[4.5rem] h-[4.5rem] text-green-500 rounded-full absolute top-4 left-5 hover:scale-110 transition ease-in-out cursor-pointer "/>
        <DotsHorizontalIcon  className="h-6 w-10 ml-8 text-gray-400 hover:text-gray-100 cursor-pointer "/>
      </div>
      {playlist?.tracks.items.map((track, i) => (
        <Song key={track.track.id} order={i} track={track} />
      ))
      }
    </div>
  )
}

export default Songs
