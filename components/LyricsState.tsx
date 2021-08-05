import axios from "axios";
import { memo, useState, useEffect } from "react";
import xml2js from 'xml2js'
import xmljs from 'xml-js'
import styles from "./LyricsPlayerStateData.module.css";

type Props = {
    track_id: string | null | undefined;
    album: string | null | undefined;
    artist: string | null | undefined;
    title: string | null | undefined;
    app_id: string | undefined;
};

export const LyricsState: React.VFC<Props> = memo(({ track_id, album, artist, title, app_id }) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState(String);

    useEffect(() => {
        const getLyrics = async () => {
            const params = new FormData();
            params.append("clientAppId", `${app_id}`);
            params.append("terminalType", "0");
            params.append("lyricsType", "3");
            params.append("key_album", `${album}`);
            params.append("key_artist", `${artist}`);
            params.append("key_title", `${title}`);
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
    }, [album, app_id, artist, title]);

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
});
LyricsState.displayName = 'LyricsState';