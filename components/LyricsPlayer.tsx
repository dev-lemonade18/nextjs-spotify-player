import { memo, useEffect } from "react";
import { usePlaybackState, usePlayerDevice, useErrorState, useWebPlaybackSDKReady, } from "react-spotify-web-playback-sdk";
import styles from "./StateConsumer.module.css";
import { StateSummary } from "./StateSummary";
import { PlaybackState } from "./PlaybackState";

type Props = {
    access_token: string;
    app_id: string | undefined
};

export const LyricsPlayer: React.VFC<Props> = memo(({ access_token, app_id }) => {
    const errorState = useErrorState();
    const webPlaybackSDKReady = useWebPlaybackSDKReady();
    const playerDevice = usePlayerDevice();
    const playbackState = usePlaybackState(true, 100);

    useEffect(() => {
        if (playerDevice?.device_id === undefined) return;

        // https://developer.spotify.com/documentation/web-api/reference/#endpoint-transfer-a-users-playback
        fetch(`https://api.spotify.com/v1/me/player`, {
            method: "PUT",
            body: JSON.stringify({ device_ids: [playerDevice.device_id], play: false }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerDevice?.device_id]);

    return (
        <div className={styles.root}>
            <StateSummary summary="useErrorState" state={errorState} />
            <StateSummary summary="useWebPlaybackSDKReady" state={webPlaybackSDKReady} />
            <StateSummary summary="usePlayerDevice" state={playerDevice} />
            <StateSummary summary="usePlaybackState" state={playbackState} />
            <PlaybackState state={playbackState} app_id={app_id} ></PlaybackState>
        </div>
    );
},
);
LyricsPlayer.displayName = 'LyricsPlayer';
