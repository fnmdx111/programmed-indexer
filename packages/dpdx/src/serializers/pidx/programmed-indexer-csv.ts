import {CsvSerializer} from "../../model/serializer"
import {PlayerBest} from "../../model/generic/player"
import {difficultyShorthand} from "../../model/generic/meta"
import moment from "moment-timezone"

export class ProgrammedIndexerCsv implements CsvSerializer {
    private static toData(best: PlayerBest): string[] {
        return [
            difficultyShorthand(best),
            best.chart.level.toString(),
            best.chart.music.folder.toString(),
            best.chart.music.title,
            best.chart.music.artist,
            best.chart.music.genre,
            best.server,
            best.lamp,
            (best.miss_count || "").toString(),
            best.ex_score.toString(),
            moment(best.timestamp).tz(moment.tz.guess()).format("YYYY-MM-DD HH:mm:ss"),
            best.chart.notes?.toString() || "N/A",
            best.chart.bpm_max
                ? best.chart.bpm_max === best.chart.bpm_min
                    ? best.chart.bpm_max.toString()
                    : `${best.chart.bpm_min} - ${best.chart.bpm_max}`
                : "N/A"
        ]
    }

    *read(bests: PlayerBest[]): Iterable<string[]> {
        for (const b of bests) {
            yield ProgrammedIndexerCsv.toData(b)
        }
    }

    readonly header: ReadonlyArray<string> = [
        "Difficulty",
        "Level",
        "Version",
        "Title",
        "Artist",
        "Genre",
        "Server",
        "Lamp",
        "Miss Count",
        "EX Score",
        "Timestamp",
        "Notes",
        "BPM"
    ]

}
