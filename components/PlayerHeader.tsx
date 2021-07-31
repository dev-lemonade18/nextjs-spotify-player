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
          <div className={styles.deviceNameTop}>
            <TextInput
              value={deviceName}
              onChange={deviceNameOnChange}
              placeholder="input your device name..."
            />
          </div>
        </div>
        <Link href="https://github.com/dev-lemonade18/nextjs-spotify-player">
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
