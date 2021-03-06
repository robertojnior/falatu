import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { format, parseISO } from 'date-fns'
import enUS from 'date-fns/locale/en-US'

import { api } from '../../config/api'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

import { usePlayer } from '../../contexts/PlayerContext'

import styles from './episode.module.scss'

type File = {
  url: string
  type: string
  duration: number
}

export type Episode = {
  id: string
  title: string
  members: string
  published_at: string
  thumbnail: string
  description: string
  file: File
}

type SerializedEpisode = Omit<Episode, 'published_at' | 'file'> & {
  url: string
  duration: number
  publishedAt: string
  durationTimeString: string
}

type EpisodeProps = { episode: SerializedEpisode }

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer()

  return (
    <div className={styles.episode}>
      <Head>
        <title>{episode.title}</title>
      </Head>

      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Back to home" />
          </button>
        </Link>

        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          alt={episode.title}
          objectFit="cover"
        />

        <button type="button" onClick={() => play([episode], 0)}>
          <img src="/play.svg" alt="Play episode" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationTimeString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const params = { _limit: 2, _sort: 'published_at', _order: 'desc' }

  const { data: episodes } = await api.get<Episode[]>('/episodes', { params })

  const paths = episodes.map(episode => ({ params: { slug: episode.id } }))

  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params

  const { data } = await api.get<Episode>(`/episodes/${slug}`)

  const { id, title, members, thumbnail, description, published_at, file: { url, duration } } = data
  const publishedAt = format(parseISO(published_at), 'd MMM yy', { locale: enUS })
  const durationTimeString = convertDurationToTimeString(duration)

  const episode = { id, title, members, thumbnail, description, url, duration, publishedAt, durationTimeString }

  return {
    props: { episode },
    revalidate: 60 * 60 * 24
  }
}
