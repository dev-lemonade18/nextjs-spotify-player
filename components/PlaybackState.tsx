import { memo, useState } from "react";
import styles from "./LyricsPlayerStateData.module.css";
import { LyricsState } from "./LyricsState";

type Props = {
    state: Spotify.PlaybackState | null;
    app_id: string | undefined
};


export const PlaybackState: React.VFC<Props> = memo(({ state, app_id }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={styles.root}>
            <LyricsState
                track_id={state?.track_window.current_track.id}
                album={state?.track_window.current_track.album.name}
                artist={state?.track_window.current_track.artists[0].name}
                title={state?.track_window.current_track.name}
                app_id={app_id}></LyricsState>
        </div>
    );
});
PlaybackState.displayName = 'PlaybackState';