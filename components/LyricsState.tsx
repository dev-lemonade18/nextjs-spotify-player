import { memo, useState, useEffect } from "react";
import axios from "axios";
import xml2js from 'xml2js'
import xmljs from 'xml-js'
import { LyricsView } from "./LyricsView";

interface Lyrics {
    line: string;
    starttime: number;
    endtime: number;
}

interface LyricsDictionary {
    [index: number]: Lyrics;
}

type Props = {
    current_time: number | null | undefined;
    track_id: string | null | undefined;
    album: string | null | undefined;
    artist: string | null | undefined;
    title: string | null | undefined;
    app_id: string | undefined;
};

export const LyricsState: React.VFC<Props> = memo(({ current_time, track_id, album, artist, title, app_id }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [lyrics_object, setObject] = useState<LyricsDictionary>();

    useEffect(() => {
        const getLyrics = async () => {
            //params
            const params = new FormData();
            params.append("clientAppId", `${app_id}`);
            params.append("terminalType", "0");
            params.append("lyricsType", "3");
            params.append("key_album", `${album}`);
            params.append("key_artist", `${artist}`);
            params.append("key_title", `${title}`);

            //headers
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            };

            //Post
            const response = await axios.post(
                'https://on.petitlyrics.com/api/GetPetitLyricsData.php', params, { headers: headers }
            ).then(res => {
                xml2js.parseString(res.data, function (err, result) {
                    if (result) {
                        const lyrics_xml = decodeURIComponent(escape(window.atob(result.response.songs[0].song[0].lyricsData[0])));
                        const lyrics_json = JSON.parse(xmljs.xml2json(lyrics_xml, { ignoreComment: true, alwaysChildren: true }))

                        // console.log(lyrics_json)
                        const lyrics_object: LyricsDictionary = {};
                        var count = 0;
                        for (var index = 1; index < Object.keys(lyrics_json.elements[0].elements).length; index++) {
                            if (Object.keys(lyrics_json.elements[0].elements[index].elements[0].elements).length == 0) {
                                continue
                            }
                            var line = lyrics_json.elements[0].elements[index].elements[0].elements[0].text
                            var starttime = lyrics_json.elements[0].elements[index].elements[2].elements[0].elements[0].text
                            var endtime = lyrics_json.elements[0].elements[index].elements[2].elements[2].elements[0].text
                            lyrics_object[count] = { line: line, starttime: starttime, endtime: endtime }
                            count++
                        }
                        setObject(lyrics_object)
                    } else if (err) {
                        //xml2js parse error
                        console.log(err.message)
                    }
                });
            }).catch(err => {
                //axios post error
                console.log(err.message);
            });
        }
        getLyrics();
    }, [album, app_id, artist, title]);

    return (
        <div>
            <LyricsView current_time={current_time} lyrics_object={lyrics_object}></LyricsView>
        </div>
    );
});
LyricsState.displayName = 'LyricsState';