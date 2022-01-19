import { atom } from "recoil"

// Holds data
export const playlistState = atom({
  key: 'playlistState',
  default: null,
})

// Holds Spotify playlist ID
export const playlistIdState = atom({
  key: "playlistIdState", // must be unique
  default: null,
});