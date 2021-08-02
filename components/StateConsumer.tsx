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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
      const res = await fetch("https://open.spotify.com/get_access_token?reason=transport&productType=web_player", {
        "headers": {
          "accept": "application/json",
          "accept-language": "ja",
          "app-platform": "WebPlayer",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "spotify-app-version": "1.1.54.35.ge9dace1d"
        },
        "referrer": "https://open.spotify.com/lyrics",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors"
      }).then((r) => r.json());
      const token = res.accessToken;

      if (playbackState?.track_window.current_track.id === undefined) return;
      if (playbackState?.track_window.current_track.album.images[0].url === undefined) return;
      const lyricJson = await fetch(`https://spclient.wg.spotify.com/color-lyrics/v1/track/${playbackState?.track_window.current_track.id}/image/${encodeURIComponent(playbackState?.track_window.current_track.album.images[0].url)}?market=from_token`, {
        "headers": {
          "accept": "application/json",
          "accept-language": "ja",
          "app-platform": "WebPlayer",
          "authorization": "Bearer " + token,
          "sec-ch-ua": "\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "spotify-app-version": "1.1.66.50.g895aca06"
        },
        "referrer": "https://open.spotify.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors"
      });
      console.log(lyricJson);
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
