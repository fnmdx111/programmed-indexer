import {CsvSerializer} from "../../model/serializer"
import {JAPANESE_HEADERS} from "../../indexers/573/573"
import {PlayerBest} from "../../model/generic/player"
import {Difficulty, PlayStyle} from "../../model/generic/meta"
import {versionName} from "../../indexers/573/folder-conversion"
import {konmaiLamp} from "../../indexers/573/misc"
import moment from "moment-timezone"

export type KonmaiCsvVersion = "old" | "new"

export class KonmaiCsv implements CsvSerializer {
    constructor(
        private readonly playStyle: PlayStyle,
        private readonly konmaiCsvVersion: KonmaiCsvVersion) {
    }

    get header(): ReadonlyArray<string> {
        if (this.konmaiCsvVersion === "new") {
            return Array.from(JAPANESE_HEADERS.keys())
        } else {
            return Array.from(JAPANESE_HEADERS.keys())
                .filter(h => !(h.startsWith("BEGINNER") || h.startsWith("LEGGENDARIA")))
        }
    }

    emptyBest(): string[] {
        return ["1", "0", "0", "0", "---", "NO PLAY", "---"]
    }

    extractBest(best: PlayerBest | undefined): string[] {
        return best
            ? [
                best.chart.level.toString(),
                best.ex_score.toString(),
                "0",
                "0",
                (best.miss_count || "---").toString(),
                konmaiLamp(best.lamp),
                "---"
            ]
            : this.emptyBest()
    }

    *read(bests: PlayerBest[]): Iterable<string[]> {
        type memT =  {[k: string]: {[d in Difficulty]?: PlayerBest}}
        const mem: memT = bests.reduce(
            (acc, best) => {
                if (best.chart.play_style === this.playStyle) {
                    const key = `${best.chart.music.title} by ${best.chart.music.artist} of ${best.chart.music.genre}`
                    if (!acc[key]) {
                        acc[key] = {}
                    }

                    acc[key][best.chart.difficulty] = best
                }

                return acc
            }, {} as memT)

        // noinspection BadExpressionStatementJS
        yield* Object.values(mem).flatMap(musicBests => {
            const common = Object.values(musicBests).find(i => i)!

            if (this.konmaiCsvVersion === "old") {
                return [
                    musicBests.LEGGENDARIA
                        ? [
                            versionName(musicBests.LEGGENDARIA.chart.music.folder),
                            musicBests.LEGGENDARIA.chart.music.title + "†",
                            musicBests.LEGGENDARIA.chart.music.genre,
                            musicBests.LEGGENDARIA.chart.music.artist,
                            "0",
                            ...this.emptyBest(),
                            ...this.emptyBest(),
                            ...this.extractBest(musicBests.LEGGENDARIA),
                            moment(musicBests.LEGGENDARIA.timestamp).format("YYYY-MM-DD HH:mm:ss")
                        ]
                        : [],
                    [
                        versionName(common.chart.music.folder),
                        common.chart.music.title,
                        common.chart.music.genre,
                        common.chart.music.artist,
                        "0",
                        ...this.extractBest(musicBests.NORMAL),
                        ...this.extractBest(musicBests.HYPER),
                        ...this.extractBest(musicBests.ANOTHER),
                        moment(common.timestamp).format("YYYY-MM-DD HH:mm:ss")
                    ]
                ]
            } else {
                return [[
                    versionName(common.chart.music.folder),
                    common.chart.music.title,
                    common.chart.music.genre,
                    common.chart.music.artist,
                    "0",
                    ...this.extractBest(musicBests.BEGINNER),
                    ...this.extractBest(musicBests.NORMAL),
                    ...this.extractBest(musicBests.HYPER),
                    ...this.extractBest(musicBests.ANOTHER),
                    ...this.extractBest(musicBests.LEGGENDARIA),
                    moment(common.timestamp).format("YYYY-MM-DD HH:mm:ss")
                ]]
            }
        })
    }
}
