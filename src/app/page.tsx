import GetGirls from './components/getGirls'
import styles from './page.module.css'

export default async function Home() {
  return (
    <main className={styles.main}>
      <GetGirls />
    </main>
  )
}
