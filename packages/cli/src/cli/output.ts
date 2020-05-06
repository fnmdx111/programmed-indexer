import {PlayerBest} from "@fnmdx111/programmed-indexer-core/dist/model/generic/player"
import {promises} from "fs"
import {Service} from "./indexer"
import moment from "moment-timezone"
import {difficultyShorthand, PlayStyle} from "@fnmdx111/programmed-indexer-core/dist/model/generic/meta"
import {table} from "table"
import {writeCsv} from "@fnmdx111/programmed-indexer-core/dist/model/serializer"
import {ProgrammedIndexerCsv} from "@fnmdx111/programmed-indexer-core/dist/serializers/pidx/programmed-indexer-csv"
import {KonmaiCsv} from "@fnmdx111/programmed-indexer-core/dist/serializers/573/573"

const header = ["Difficulty", "Level", "Version", "Title", "Artist", "Genre", "Server", "Lamp", "Miss Count", "EX Score", "Timestamp", "Notes", "BPM"]

export type OutputFormat = "json" | "csv" | "konmai-pre-27.csv" | "konmai-27.csv"
export interface PerformSaveOptions {
    output?: string
    outputFormat: OutputFormat
    service: Service
    playStyle: PlayStyle
}

function toData(best: PlayerBest): (string | number)[] {
    return [
        difficultyShorthand(best),
        best.chart.level,
        best.chart.music.folder,
        best.chart.music.title,
        best.chart.music.artist,
        best.chart.music.genre,
        best.server,
        best.lamp,
        (best.miss_count || "").toString(),
        best.ex_score,
        moment(best.timestamp).tz(moment.tz.guess()).format("YYYY-MM-DD HH:mm:ss"),
        best.chart.notes || "N/A",
        best.chart.bpm_max
            ? best.chart.bpm_max === best.chart.bpm_min ? best.chart.bpm_max : `${best.chart.bpm_min} - ${best.chart.bpm_max}`
            : "N/A"
    ]
}

export function performSave(data: PlayerBest[], {output, outputFormat, service, playStyle}: PerformSaveOptions) {
    let out
    if (outputFormat === "json") {
        out = JSON.stringify(data, undefined, 2)
    } else {
        const csv = {
            "konmai-27.csv": new KonmaiCsv(playStyle, "new"),
            "konmai-pre-27.csv": new KonmaiCsv(playStyle, "old"),
            "csv": new ProgrammedIndexerCsv()
        }[outputFormat]
        out = writeCsv(csv, data)
    }

    return promises.writeFile(
        output || `./${service}-${moment().format("YYYYMMDD-HHmmss")}.${outputFormat}`,
        out,
        {encoding: "utf8"})
}

export function performConsoleTabling(data: PlayerBest[]): void {
    const tablingData = data.map(toData)
    console.info(table([header].concat(tablingData as never[]), {
        columns: {
            0: {
                width: 5
            },
            3: {
                width: 15
            },
            4: {
                width: 15
            },
            5: {
                width: 10
            }
        }
    }))
}
