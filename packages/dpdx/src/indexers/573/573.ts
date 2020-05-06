/* eslint-disable @typescript-eslint/no-explicit-any */

import {PlayerBestIndexer} from "../../model/indexer"
import {PlayerBest} from "../../model/generic/player"
import {ALL_DIFFICULTIES, Difficulty, PlayStyle} from "../../model/generic/meta"
import Papa, {ParseResult} from "papaparse"
import {folder} from "./folder-conversion"
import {int, lamp} from "./misc"
import moment from "moment-timezone"

export const JAPANESE_HEADERS: Map<string, string> = new Map([
    ["バージョン", "version"],
    ["タイトル", "title"],
    ["ジャンル", "genre"],
    ["アーティスト", "artist"],
    ["プレー回数", "play_count"],

    ["BEGINNER 難易度", "beginner_rating"],
    ["BEGINNER EXスコア", "beginner_ex_score"],
    ["BEGINNER PGreat", "beginner_pgreat"],
    ["BEGINNER Great", "beginner_great"],
    ["BEGINNER ミスカウント", "beginner_miss_count"],
    ["BEGINNER クリアタイプ", "beginner_lamp"],
    ["BEGINNER DJ LEVEL", "beginner_dj_level"],

    ["NORMAL 難易度", "normal_rating"],
    ["NORMAL EXスコア", "normal_ex_score"],
    ["NORMAL PGreat", "normal_pgreat"],
    ["NORMAL Great", "normal_great"],
    ["NORMAL ミスカウント", "normal_miss_count"],
    ["NORMAL クリアタイプ", "normal_lamp"],
    ["NORMAL DJ LEVEL", "normal_dj_level"],

    ["HYPER 難易度", "hyper_rating"],
    ["HYPER EXスコア", "hyper_ex_score"],
    ["HYPER PGreat", "hyper_pgreat"],
    ["HYPER Great", "hyper_great"],
    ["HYPER ミスカウント", "hyper_miss_count"],
    ["HYPER クリアタイプ", "hyper_lamp"],
    ["HYPER DJ LEVEL", "hyper_dj_level"],

    ["ANOTHER 難易度", "another_rating"],
    ["ANOTHER EXスコア", "another_ex_score"],
    ["ANOTHER PGreat", "another_pgreat"],
    ["ANOTHER Great", "another_great"],
    ["ANOTHER ミスカウント", "another_miss_count"],
    ["ANOTHER クリアタイプ", "another_lamp"],
    ["ANOTHER DJ LEVEL", "another_dj_level"],

    ["LEGGENDARIA 難易度", "leggendaria_rating"],
    ["LEGGENDARIA EXスコア", "leggendaria_ex_score"],
    ["LEGGENDARIA PGreat", "leggendaria_pgreat"],
    ["LEGGENDARIA Great", "leggendaria_great"],
    ["LEGGENDARIA ミスカウント", "leggendaria_miss_count"],
    ["LEGGENDARIA クリアタイプ", "leggendaria_lamp"],
    ["LEGGENDARIA DJ LEVEL", "leggendaria_dj_level"],

    ["最終プレー日時", "timestamp"]
])

export class KonmaiIndexer implements PlayerBestIndexer {
    private readonly rawItems: ParseResult;

    constructor(
        private readonly rawData: string,
        private readonly playstyle: PlayStyle) {
        this.rawItems = Papa.parse(rawData.trim(), {
            header: true,
            dynamicTyping(header) {
                return header !== "title"
            },
            transformHeader(header) {
                return JAPANESE_HEADERS.get(header)!
            }
        })
    }

    private processPlayerBest(raw: any, difficulty: Difficulty): PlayerBest[] {
        const f = (name: string) => `${difficulty.toLowerCase()}_${name}`

        if (raw[f("dj_level")] === "---" || raw[f("lamp")] === "NO PLAY") {
            return []
        } else {
            return [{
                chart: {
                    difficulty: difficulty,
                    level: int(raw[f("rating")]),
                    play_style: this.playstyle,
                    music: {
                        artist: raw["artist"],
                        folder: folder(raw["version"]),
                        genre: raw["genre"],
                        title: raw["title"]
                    }
                },
                ex_score: int(raw[f("ex_score")]),
                lamp: lamp(raw[f("lamp")]),
                miss_count: int(raw[f("miss_count")]),
                server: "573",
                timestamp: moment.tz(raw["timestamp"], "Asia/Tokyo").toDate()
            }]
        }
    }

    async *index(): AsyncIterable<PlayerBest> {
        await Promise.resolve()
        yield* this.rawItems
            .data.flatMap(o => ALL_DIFFICULTIES
                .flatMap(difficulty => this.processPlayerBest(o, difficulty)))
    }
}
