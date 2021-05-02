import '../styles/global.scss'

import { useState } from 'react'

import { PlayerContext, PlayerEpisode } from '../contexts/PlayerContext'

import { Header } from '../components/Header'
import { Player } from '../components/Player'

import styles from '../styles/app.module.scss'

function MyApp({ Component, pageProps }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [nowPlaying, setNowPlaying] = useState(0)
  const [episodes, setEpisodes] = useState<PlayerEpisode[]>([])

  function togglePlay() {
    setIsPlaying(playing => !playing)
  }

  function playEpisode(episode: PlayerEpisode) {
    setIsPlaying(true)
    setNowPlaying(0)
    setEpisodes([episode])
  }

  function setPlayingState(playing: boolean) {
    setIsPlaying(playing)
  }

  return (
    <PlayerContext.Provider value={{
      isPlaying,
      nowPlaying,
      episodes,
      togglePlay,
      playEpisode,
      setPlayingState
    }}>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>

        <Player />
      </div>
    </PlayerContext.Provider >
  )
}

export default MyApp
