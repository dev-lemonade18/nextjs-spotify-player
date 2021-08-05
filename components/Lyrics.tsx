import axios from "axios";
import { memo, useEffect, useState } from "react";
import {
    usePlaybackState,
    usePlayerDevice,
    useErrorState,
    useWebPlaybackSDKReady,
} from "react-spotify-web-playback-sdk";
import xml2js from 'xml2js'
import xmljs from 'xml-js'
import styles from "./StateSummary.module.css";


export const Lyrics: React.VFC<{ access_token: string }> = memo(({ access_token }, { token }) => {
    const [open, setOpen] = useState(true);
    const [data, setData] = useState(String);

    const playbackState = usePlaybackState(true, 100);
    const playerDevice = usePlayerDevice();

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
    }, []);

    useEffect(() => {
        const getLyrics = async () => {
            const params = new FormData();
            params.append("clientAppId", String(process.env.LYRICS_CLIENT_APP_ID));
            params.append("terminalType", "0");
            params.append("lyricsType", "3");
            params.append("key_album", `${playbackState?.track_window.current_track.album.name}`);
            params.append("key_artist", `${playbackState?.track_window.current_track.artists[0].name}`);
            params.append("key_title", `${playbackState?.track_window.current_track.name}`);
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            };
            const response = await axios.post(
                'https://on.petitlyrics.com/api/GetPetitLyricsData.php', params, { headers: headers }
            ).then(res => {
                xml2js.parseString(res.data, function (err, result) {
                    if (err) {
                        console.log(err.message)
                    } else {
                        const lyricsData = decodeURIComponent(escape(window.atob(result.response.songs[0].song[0].lyricsData[0])));
                        const lyricsDataJson = JSON.parse(xmljs.xml2json(lyricsData, { ignoreComment: true, alwaysChildren: true }))
                        setData(lyricsDataJson)
                    }
                });
            }).catch(err => {
                console.log(err.message);
                setData("false")
            });
        }
        getLyrics();
    }, []);

    return (
        <details
            className={styles.root}
            open={open}
            onToggle={() => setOpen(prev => !prev)}>
            <summary>
                <code>Lyrics</code>
            </summary>
            <pre>
                <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
        </details>
    );
},
);
Lyrics.displayName = 'Lyrics';
