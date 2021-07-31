import styles from "../styles/index.module.css";
import Image from 'next/image'
import Link from "next/link"

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>React Web Playback SDK Demo App</h1>
      <Image
        priority
        className={styles.logo}
        src="/react-spotify-web-playback-sdk-logo.png"
        width={2000}
        height={1000}
        alt="logo"
      />
      <div className={styles.links}>
        <Link href="/api/login">
          <a className={styles.signinLink}>
            Sign-in with Spotify
          </a>
        </Link>
        <a
          className={styles.githubLink}
          rel="noopner noreferer"
          href="https://github.com/y-hiraoka/react-spotify-web-playback-sdk">
          GitHub Repository
        </a>
      </div>
    </div>
  );
}
