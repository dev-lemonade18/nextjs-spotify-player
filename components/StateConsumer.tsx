import { memo, useEffect } from "react";
import {
  usePlaybackState,
  usePlayerDevice,
  useErrorState,
  useWebPlaybackSDKReady,
} from "react-spotify-web-playback-sdk";
import styles from "./StateConsumer.module.css";
import { StateSummary } from "./StateSummary";

export const StateConsumer: React.VFC<{ access_token: string }> = memo(
  ({ access_token }) => {
    const playbackState = usePlaybackState(true, 100);
    const playerDevice = usePlayerDevice();
    const errorState = useErrorState();
    const webPlaybackSDKReady = useWebPlaybackSDKReady();

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

    useEffect(() => {
      if (playbackState?.track_window === undefined) return;
      fetch(`https://spclient.wg.spotify.com/color-lyrics/v1/track/${playbackState?.track_window.current_track.id}/image/${encodeURIComponent(playbackState?.track_window.current_track.album.images[0].url)}?market=from_token`, {
        "headers": {
          "accept": "application/json",
          "accept-language": "ja",
          "app-platform": "WebPlayer",
          "authorization": "Bearer " + access_token,
          "sec-ch-ua": "\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
          "sec-ch-ua-mobile": "?0",
          "spotify-app-version": "1.1.66.45.gbab0f163"
        },
        "referrer": "https://open.spotify.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors"
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playbackState?.track_window]);

    return (
      <div className={styles.root}>
        <StateSummary summary="useWebPlaybackSDKReady" state={webPlaybackSDKReady} />
        <StateSummary summary="usePlaybackState" state={playbackState} />
        <StateSummary summary="usePlayerDevice" state={playerDevice} />
        <StateSummary summary="useErrorState" state={errorState} />
      </div>
    );
  },
);
StateConsumer.displayName = 'StateConsumer';
