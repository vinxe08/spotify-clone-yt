import { useEffect } from "react";
import { useRecoilState } from "recoil"
import { RecommendedState } from "../atoms/RecommendedAtom"
import useSpotify from '../hooks/useSpotify';
// import { join } from 'lodash'

function Recommended({ recommendedId }) {
  const spotifyApi = useSpotify();
  const [recommendList, setRecommendList] = useRecoilState(RecommendedState)

  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + "..." : string;
  }
  
  useEffect(() => {
    // to get seed_artists, playlist.tracks.items?.[0]track.artists?.[0].id
    spotifyApi
      .getRecommendations({
        min_energy: 0.4,
        seed_artists: [recommendedId],
        min_popularity: 50
      })
      .then((data) => {
        let recommendations = data.body.tracks;
        setRecommendList(recommendations)
      })
      .catch((err) => {
        console.log(err);
      })
  },[spotifyApi, recommendedId])

  return (
    <div className='flex flex-col space-y-1 text-white bg-[#1f1d1dc2] pt-[3rem] pb-[10rem] px-8 '>
      {/* Recommended based on Spotify ID */}
      <h1 className="ml-auto uppercase font-bold text-xs p-2 pr-4 tracking-wide">Find more</h1>
      <div className="space-y-2 pb-6">
        <h1 className="text-2xl font-bold">Recommended</h1>
        <h2 className="text-gray-300 text-sm">Based on what's in this playlist</h2>
      </div>
      {recommendList && Object.values(recommendList).map(track => (
        <div key={track.id} className="flex hover:bg-[#4d4c4c80] px-[0.7rem] py-[.3rem] rounded-md cursor-pointer transition ease-out ">
          <div className="flex-auto w-64 flex flex-row items-center space-x-4 pr-2">
            <img src={track.album?.images[0].url} alt="" className="h-10 w-10 rounded-sm" />
            <div className="flex flex-col">
              <h1>{track.name}</h1>
              <div className="flex space-x-1">
               <h1 className="text-gray-300">{track.artists[0].name}</h1>
              </div>
            </div>
          </div>
          <div className="flex-auto w-28 flex flex-row items-center">
            <h1 className="text-gray-300 pr-2">{truncate(track.album.name, 40)}</h1>
            <button className="ml-auto border-[1px] px-8 py-[.45rem] rounded-full text-[11.5px] font-extrabold text-gray-300 border-gray-600 hover:border-white hover:text-white hover:scale-105 transition ease-in-out active:scale-90">ADD</button>
          </div>
      </div>
      )) }
    </div>
  )
}

export default Recommended
