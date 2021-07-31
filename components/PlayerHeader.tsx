import styles from "./PlayerHeader.module.css";
import { TextInput } from "./TextInput";
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  deviceName: string;
  deviceNameOnChange: (name: string) => void;
};

export const PlayerHeader: React.VFC<Props> = ({
  deviceName,
  deviceNameOnChange,
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <div className={styles.headerLeft}>
          <Image
            priority
            className={styles.smallLogo}
            width={48}
            height={48}
            src="/logo-small.png"
            alt="small logo">
          </Image>
          <div className={styles.deviceNameTop}>
            <TextInput
              value={deviceName}
              onChange={deviceNameOnChange}
              placeholder="input your device name..."
            />
          </div>
        </div>
        <Link href="https://github.com/y-hiraoka/react-spotify-web-playback-sdk">
          <a
            className={styles.githubLink}
            target="_blank"
            rel="noopener noreferer">
            GitHub
          </a>
        </Link>
      </div>
      <div className={styles.headerBottom}>
        <TextInput
          value={deviceName}
          onChange={deviceNameOnChange}
          placeholder="input device name..."
        />
      </div>
    </header>
  );
};
