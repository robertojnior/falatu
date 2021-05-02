import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { format, parseISO } from 'date-fns'
import enUS from 'date-fns/locale/en-US'

import { api } from '../../config/api'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

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
  publishedAt: string
  durationTimeString: string
}

type EpisodeProps = { episode: SerializedEpisode }

export default function Episode({ episode }: EpisodeProps) {
  return (
    <div className={styles.episode}>
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

        <button type="button">
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
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params

  const { data } = await api.get<Episode>(`/episodes/${slug}`)

  const { id, title, members, thumbnail, description, published_at, file: { duration } } = data
  const publishedAt = format(parseISO(published_at), 'd MMM yy', { locale: enUS })
  const durationTimeString = convertDurationToTimeString(duration)

  const episode = { id, title, members, thumbnail, description, publishedAt, durationTimeString }

  return {
    props: { episode },
    revalidate: 60 * 60 * 24
  }
}
