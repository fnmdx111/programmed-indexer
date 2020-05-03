import {PlayerBest} from "@fnmdx111/programmed-indexer-core/lib/model/generic/player"
import {promises} from "fs"
import {Service} from "./indexer"
import moment from "moment-timezone"
import {difficultyShorthand} from "@fnmdx111/programmed-indexer-core/lib/model/generic/meta"
import {table} from "table"

const header = ["Difficulty", "Level", "Version", "Title", "Artist", "Genre", "Server", "Lamp", "Miss Count", "EX Score", "Timestamp", "Notes", "BPM"]

export type OutputFormat = "json" | "csv"
export interface PerformSaveOptions {
    output?: string
    outputFormat: OutputFormat
    service: Service
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
        best.miss_count,
        best.ex_score,
        moment(best.timestamp).tz(moment.tz.guess()).format("YYYY-MM-DD HH:mm:ss"),
        best.chart.notes || "N/A",
        best.chart.bpm_max
            ? best.chart.bpm_max === best.chart.bpm_min ? best.chart.bpm_max : `${best.chart.bpm_min} - ${best.chart.bpm_max}`
            : "N/A"
    ]
}

export function performSave(data: PlayerBest[], {output, outputFormat, service}: PerformSaveOptions) {
    let out
    if (outputFormat === "json") {
        out = JSON.stringify(data, undefined, 2)
    } else {
        const buffer = []
        buffer.push(header.join(","))
        buffer.push(...data.map(toData).map(d => d.map(x => `"${x}"`).join(",")))
        out = buffer.join("\n")
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
