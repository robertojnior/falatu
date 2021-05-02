import { useState, createContext, ReactNode } from 'react'

import { Episode } from '../pages/episodes/[slug]'

type SerializedEpisode = Pick<Episode, 'title' | 'members' | 'thumbnail'> & {
  url: string
  duration: number
}

type ContextProps = {
  isPlaying: boolean
  nowPlaying: number
  episodes: SerializedEpisode[]

  togglePlay(): void
  playEpisode(episode: SerializedEpisode): void
  setPlayingState(playing: boolean): void
}

type ProviderProps = { children: ReactNode }

export const PlayerContext = createContext({} as ContextProps)

export function PlayerContextProvider({ children }: ProviderProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [nowPlaying, setNowPlaying] = useState(0)
  const [episodes, setEpisodes] = useState<SerializedEpisode[]>([])

  function togglePlay() {
    setIsPlaying(playing => !playing)
  }

  function playEpisode(episode: SerializedEpisode) {
    setIsPlaying(true)
    setNowPlaying(0)
    setEpisodes([episode])
  }

  function setPlayingState(playing: boolean) {
    setIsPlaying(playing)
  }

  return (
    <PlayerContext.Provider
      value={{
        isPlaying,
        nowPlaying,
        episodes,
        togglePlay,
        playEpisode,
        setPlayingState
      }}>

      {children}
    </PlayerContext.Provider>
  )
}
