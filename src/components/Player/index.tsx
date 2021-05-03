import 'rc-slider/assets/index.css'

import { useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import Slider from 'rc-slider'

import { usePlayer } from '../../contexts/PlayerContext'

import styles from './styles.module.scss'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

export function Player() {
  const {
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
    next,
    previous
  } = usePlayer()

  const audioRef = useRef<HTMLAudioElement>(null)

  const [progress, setProgress] = useState(0)

  const episode = episodes[nowPlayingIndex]

  useEffect(() => {
    if (!audioRef.current) return

    isPlaying ? audioRef.current.play() : audioRef.current.pause()

  }, [isPlaying])

  function audioProgressListener() {
    audioRef.current.currentTime = 0

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  return (
    <div className={styles.playerContainer}>
      {episode && (
        <audio
          ref={audioRef}
          src={episode.url}
          onPlay={() => setPlayingState(true)}
          onPause={() => setPlayingState(false)}
          onLoadedMetadata={audioProgressListener}
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
          <span>{convertDurationToTimeString(progress)}</span>

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

          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        <div className={styles.buttons}>
          <button
            type="button"
            className={isShuffling ? styles.isActive : ''}
            onClick={toggleShuffle}
            disabled={!episode || episodes.length === 1}
          >
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
