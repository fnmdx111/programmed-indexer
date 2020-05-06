import {PlayerBest} from "./generic/player"

export interface CsvSerializer {
    readonly header: ReadonlyArray<string>
    read(bests: PlayerBest[]): Iterable<string[]>
}

export function writeCsv(ser: CsvSerializer, bests: PlayerBest[]): string {
    function* conv(): Iterable<string> {
        yield ser.header.join(",")

        for (const d of ser.read(bests)) {
            if (d.length === 0) {
                continue
            }
            yield d.map(c => c.includes(",") ? `"${c}"` : c).join(",")
        }
    }

    return Array.from(conv())
        .map(line => line.replace("〜", "～"))
        .join("\n")
}
