import {PlayerBestIndexer} from "../../model/indexer"
import {PlayerBest} from "../../model/generic/player"
import {promises} from "fs"

export class JsonIndexer implements PlayerBestIndexer {
    constructor(private readonly path: string) {
    }


    async *index(): AsyncIterable<PlayerBest> {
        const content = await promises.readFile(this.path, {encoding: "utf8"})
        yield* JSON.parse(content)
    }
}
