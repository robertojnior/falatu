import { useState, createContext, ReactNode, useContext } from 'react'

import { Episode } from '../pages/episodes/[slug]'

type SerializedEpisode = Pick<Episode, 'title' | 'members' | 'thumbnail'> & {
  url: string
  duration: number
}

type ContextProps = {
  isPlaying: boolean
  episodes: SerializedEpisode[]
  nowPlayingIndex: number
  hasNext: boolean
  hasPrevious: boolean

  toggleIsPlaying(): void
  setPlayingState(playing: boolean): void

  play(episodes: SerializedEpisode[], nowPlayingIndex: number): void
  next(): void
  previous(): void
}

type ProviderProps = { children: ReactNode }

export const PlayerContext = createContext({} as ContextProps)

export const usePlayer = () => useContext(PlayerContext)

export function PlayerContextProvider({ children }: ProviderProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [episodes, setEpisodes] = useState<SerializedEpisode[]>([])
  const [nowPlayingIndex, setNowPlayingIndex] = useState(0)

  const hasNext = (nowPlayingIndex + 1) < episodes.length
  const hasPrevious = nowPlayingIndex > 0

  function toggleIsPlaying() {
    setIsPlaying(playing => !playing)
  }

  function setPlayingState(playing: boolean) {
    setIsPlaying(playing)
  }

  function play(playlist: SerializedEpisode[], episodeIndex: number) {
    setIsPlaying(true)
    setEpisodes(playlist)
    setNowPlayingIndex(episodeIndex)
  }

  function next() {
    if (!hasNext) {
      return
    }

    setNowPlayingIndex(nowPlayingIndex + 1)
  }

  function previous() {
    if (!hasPrevious) {
      return
    }

    setNowPlayingIndex(nowPlayingIndex - 1)
  }


  return (
    <PlayerContext.Provider
      value={{
        isPlaying,
        episodes,
        nowPlayingIndex,
        hasNext,
        hasPrevious,

        toggleIsPlaying,
        setPlayingState,

        play,
        next,
        previous
      }}>

      {children}
    </PlayerContext.Provider>
  )
}
