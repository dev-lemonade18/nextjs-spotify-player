import styles from "../styles/index.module.css";
import Image from 'next/image'
import Link from "next/link"

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Next.js - Spotify Web Player</h1>
      <div className={styles.links}>
        <Link href="/api/login">
          <a className={styles.signinLink}>
            Sign-in with Spotify
          </a>
        </Link>
      </div>
    </div>
  );
}
