import { memo, useState, useEffect } from "react";
import styles from "./LyricsPlayerStateData.module.css";

interface Lyrics {
    line: string;
    starttime: number;
    endtime: number;
}

interface LyricsDictionary {
    [index: number]: Lyrics;
}

type Props = {
    current_time: number | null | undefined
    lyrics_object: LyricsDictionary | undefined
};

export const LyricsView: React.VFC<Props> = memo(({ current_time, lyrics_object }) => {
    const [open, setOpen] = useState<boolean>(false);
    var lyric = ""
    if (lyrics_object !== undefined && current_time !== undefined && current_time !== null) {
        for (var index = 0; index < Object.keys(lyrics_object).length; index++) {
            if (lyrics_object[index].starttime <= current_time + 500 && current_time + 500 >= lyrics_object[index].endtime) {
                lyric = lyrics_object[index].line
            }
        }
    }


    return (
        <div>
            <details
                className={styles.root}
                open={open}
                onToggle={() => setOpen(prev => !prev)}>
                <summary>
                    <code>Lyrics</code>
                </summary>
                <pre>
                    <code>{JSON.stringify(lyrics_object, null, 2)}</code>
                </pre>
            </details>
            <label>{lyric}</label>
        </div>
    );
});
LyricsView.displayName = 'LyricsView';