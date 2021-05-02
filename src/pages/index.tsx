export default function Home(props) {
  return <h1>Index</h1>
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
export async function getStaticProps() {
  const response = await fetch('http://localhost:4000/episodes')
  const episodes = await response.json()

  return {
    props: { episodes },
    revalidate: 60 * 60 * 8
  }
}
