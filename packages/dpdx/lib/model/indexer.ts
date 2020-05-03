import {PlayerBest} from "./generic/player"

export interface PlayerBestIndexer {
    index(): AsyncIterable<PlayerBest>
}
