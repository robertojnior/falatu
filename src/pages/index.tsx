import { GetStaticProps } from 'next'
import Image from 'next/image'

import { format, parseISO } from 'date-fns'
import enUS from 'date-fns/locale/en-US'

import { api } from '../config/api'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'

import styles from './home.module.scss'

type File = {
  url: string
  duration: number
}

type Episode = {
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

type HomeProps = {
  latestEpisodes: SerializedEpisode[]
  allEpisodes: SerializedEpisode[]
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Latest episodes</h2>

        <ul>
          {
            latestEpisodes.map(episode => {
              return (
                <li key={episode.id}>
                  <Image
                    width={192}
                    height={192}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                  />

                  <div className={styles.episodeDetails}>
                    <a href="">{episode.title}</a>

                    <p>{episode.members}</p>

                    <span>{episode.publishedAt}</span>

                    <span>{episode.durationTimeString}</span>
                  </div>

                  <button type="button">
                    <img src="/play-green.svg" alt="Play episode" />
                  </button>
                </li>
              )
            })
          }
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>All episodes</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Members</th>
              <th>Date</th>
              <th>Duration</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {
              allEpisodes.map(episode => {
                return (
                  <tr key={episode.id}>
                    <td style={{ width: 72 }}>
                      <Image
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                      />
                    </td>

                    <td>
                      <a href="">{episode.title}</a>
                    </td>

                    <td>{episode.members}</td>
                    <td style={{ width: 100 }}>{episode.publishedAt}</td>
                    <td>{episode.durationTimeString}</td>

                    <td>
                      <button type="button">
                        <img src="/play-green.svg" alt="Play episode" />
                      </button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </section>
    </div>
  )
}

// Nextjs SSR (Server Side Rendering)
// export async function getServerSideProps() {
//   const response = await fetch('http://localhost:4000/episodes')
//   const episodes = await response.json()

//   return {
//     props: { episodes }
//   }
// }


// Nextjs SSG (Static Site Generation)
export const getStaticProps: GetStaticProps = async () => {
  const params = { _limit: 12, _sort: 'published_at', _order: 'desc' }

  const { data } = await api.get<Episode[]>('/episodes', { params })

  const episodes = data.map(episode => {
    const { id, members, title, thumbnail, published_at, description, file: { duration } } = episode
    const publishedAt = format(parseISO(published_at), 'd MMM yy', { locale: enUS })
    const durationTimeString = convertDurationToTimeString(duration)

    return { id, members, title, thumbnail, description, publishedAt, durationTimeString }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: { latestEpisodes, allEpisodes },
    revalidate: 60 * 60 * 8
  }
}
