import { createContext } from 'react'

import { Episode } from '../pages/episodes/[slug]'

export type PlayerEpisode = Pick<Episode, 'title' | 'members' | 'thumbnail'> & {
  url: string
  duration: number
}

type PlayerContextData = {
  isPlaying: boolean
  nowPlaying: number
  episodes: PlayerEpisode[]

  togglePlay(): void
  playEpisode(episode: PlayerEpisode): void
  setPlayingState(playing: boolean): void
}

export const PlayerContext = createContext({} as PlayerContextData)
