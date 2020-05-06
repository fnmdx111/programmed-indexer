import {PlayerBestIndexer} from "@fnmdx111/programmed-indexer-core/dist/model/indexer"
import {readFileSync} from "fs"
import {ArcanaIndexer} from "@fnmdx111/programmed-indexer-core/dist/indexers/arcana/arcana"
import {KonmaiIndexer} from "@fnmdx111/programmed-indexer-core/dist/indexers/573/573"
import {JsonIndexer} from "@fnmdx111/programmed-indexer-core/dist/indexers/json/json"
import {PlayStyle} from "@fnmdx111/programmed-indexer-core/dist/model/generic/meta"
import fetch from "node-fetch"

export type Service = "arcana" | "konmai" | "local-json"
export interface GetIndexerOptions {
    input?: string
    playStyle?: PlayStyle
}

interface ArcanaConfig {
    token: string
    baseUrl: string
    version?: number
}

export function getIndexer(
    service: Service,
    {input, playStyle}: GetIndexerOptions): PlayerBestIndexer {

    switch (service) {
    case "arcana": {
        const config: ArcanaConfig = JSON.parse(readFileSync(input || "./config.json").toString("utf8"))
        return new ArcanaIndexer(config.version || 26, config.token, config.baseUrl, fetch)
    }
    case "konmai": {
        if (!input) {
            console.error("You need to specify the path to your Konmai player data")
            process.exit(1)
        }
        if (!playStyle) {
            console.error("You need to specify the play style (SINGLE, DOUBLE) for your Konmai player data")
            process.exit(1)
        }

        const inputCsv: string = readFileSync(input).toString("utf8")
        return new KonmaiIndexer(inputCsv, playStyle)
    }
    case "local-json": {
        if (!input) {
            console.error("You need to specify the path to your previously indexed JSON file")
            process.exit(1)
        }

        return new JsonIndexer(input)
    }
    }
}
