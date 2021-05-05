import { useState, createContext, ReactNode, useContext } from 'react'

import { Episode } from '../pages/episodes/[slug]'

type SerializedEpisode = Pick<Episode, 'title' | 'members' | 'thumbnail'> & {
  url: string
  duration: number
}

type ContextProps = {
  isPlaying: boolean
  inLoop: boolean
  isShuffling: boolean

  episodes: SerializedEpisode[]
  nowPlayingIndex: number

  hasNext: boolean
  hasPrevious: boolean

  setPlayingState(playing: boolean): void
  togglePlay(): void
  toggleLoop(): void
  toggleShuffle(): void

  play(episodes: SerializedEpisode[], nowPlayingIndex: number): void
  next(): void
  previous(): void
}

type ProviderProps = { children: ReactNode }

export const PlayerContext = createContext({} as ContextProps)

export const usePlayer = () => useContext(PlayerContext)

export function PlayerContextProvider({ children }: ProviderProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [inLoop, setInLoop] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  const [episodes, setEpisodes] = useState<SerializedEpisode[]>([])
  const [nowPlayingIndex, setNowPlayingIndex] = useState(0)

  const hasNext = isShuffling || ((nowPlayingIndex + 1) < episodes.length)
  const hasPrevious = isShuffling || nowPlayingIndex > 0

  function setPlayingState(playing: boolean) {
    setIsPlaying(playing)
  }

  function togglePlay() {
    setIsPlaying(playing => !playing)
  }

  function toggleLoop() {
    setInLoop(looping => !looping)
    setIsShuffling(false)
  }

  function toggleShuffle() {
    setIsShuffling(shuffling => !shuffling)
    setInLoop(false)
  }

  function play(playlist: SerializedEpisode[], episodeIndex: number) {
    setIsPlaying(true)
    setEpisodes(playlist)
    setNowPlayingIndex(episodeIndex)
  }

  function next() {
    if (isShuffling) {
      shuffle()

      return
    }

    if (!hasNext) return

    setNowPlayingIndex(nowPlayingIndex + 1)
  }

  function previous() {
    if (isShuffling) {
      shuffle()

      return
    }

    if (!hasPrevious) return

    setNowPlayingIndex(nowPlayingIndex - 1)
  }

  function shuffle() {
    const randomNowPlayingIndex = Math.floor(Math.random() * episodes.length)

    setNowPlayingIndex(randomNowPlayingIndex)
  }

  return (
    <PlayerContext.Provider
      value={{
        isPlaying,
        inLoop,
        isShuffling,

        episodes,
        nowPlayingIndex,

        hasNext,
        hasPrevious,

        setPlayingState,
        togglePlay,
        toggleLoop,
        toggleShuffle,

        play,
        next,
        previous
      }}>

      {children}
    </PlayerContext.Provider>
  )
}
