import 'rc-slider/assets/index.css'

import { useEffect, useRef } from 'react'

import Image from 'next/image'

import Slider from 'rc-slider'

import { usePlayer } from '../../contexts/PlayerContext'

import styles from './styles.module.scss'

export function Player() {
  const {
    isPlaying,
    inLoop,
    episodes,
    nowPlayingIndex,
    hasNext,
    hasPrevious,
    setPlayingState,
    togglePlay,
    toggleLoop,
    next,
    previous
  } = usePlayer()

  const episode = episodes[nowPlayingIndex]

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!audioRef.current) return

    isPlaying ? audioRef.current.play() : audioRef.current.pause()

  }, [isPlaying])

  return (
    <div className={styles.playerContainer}>
      {episode && (
        <audio
          ref={audioRef}
          src={episode.url}
          onPlay={() => setPlayingState(true)}
          onPause={() => setPlayingState(false)}
          loop={inLoop}
          autoPlay
        />
      )}

      <header>
        <img src="/playing.svg" alt="Now playing" />

        <strong>Now playing</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />

          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Select a podcast to listen</strong>
        </div>
      )}


      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>00:00</span>

          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>

          <span>00:00</span>
        </div>

        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
            <img src="/shuffle.svg" alt="" />
          </button>

          <button type="button" onClick={previous} disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="" />
          </button>

          <button type="button" className={styles.playButton} onClick={togglePlay} disabled={!episode}>
            {isPlaying ? <img src="/pause.svg" alt="" /> : <img src="/play.svg" alt="" />}
          </button>

          <button type="button" onClick={next} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="" />
          </button>

          <button
            type="button"
            className={inLoop ? styles.isActive : ''}
            onClick={toggleLoop}
            disabled={!episode}
          >
            <img src="/repeat.svg" alt="" />
          </button>
        </div>
      </footer>
    </div>
  )
}
