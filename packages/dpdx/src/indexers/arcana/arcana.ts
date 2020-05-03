/* eslint-disable @typescript-eslint/no-explicit-any */

import {PlayerBestIndexer} from "../../model/indexer"
import {PlayerBest} from "../../model/generic/player"
import fetch from "node-fetch"
import {Chart, Music} from "../../model/generic/meta"
import {makeIndex, rawChartToChart, rawMusicToMusic, rawPlayerBestToPlayerBest} from "./misc"

export class ArcanaIndexer implements PlayerBestIndexer {
    private readonly headers: {}
    private readonly baseUrl: string

    constructor(
        private readonly version: number,
        token: string,
        baseUrl: string) {
        this.headers = {
            Authorization: `Bearer ${token}`
        }
        this.baseUrl = `${baseUrl}/iidx`
    }

    private async getPlayerBestsUrl() {
        return fetch(
            `${this.baseUrl}/${this.version.toString()}/`,
            {
                headers: this.headers
            })
            .then(r => r.json())
            .then(j => j._links.my_bests)
    }

    private static processPlayerBest(best: any, charts: Map<string, any>, musics: Map<string, any>): PlayerBest {
        const music: Music = rawMusicToMusic(musics.get(best.music_id))
        const chart: Chart = rawChartToChart(charts.get(best.chart_id), music)
        return rawPlayerBestToPlayerBest(best, chart)
    }

    private async fetchBests(url: string): Promise<[string | undefined, PlayerBest[]]> {
        const j = await fetch(url, {headers: this.headers}).then(r => r.json()).catch(e => {
            console.error(`Error while fetching bests ${e.message}`)
            throw e
        })

        const bests = j._items as any[]
        const charts = makeIndex<{_id: string}, string>(j._related.charts, c => c._id)
        const musics = makeIndex<{_id: string}, string>(j._related.music, m => m._id)
        const nextPageUrl = j._links._next

        return [nextPageUrl, bests.map(b => ArcanaIndexer.processPlayerBest(b, charts, musics))]
    }

    async *index(): AsyncIterable<PlayerBest> {
        const startUrl = await this.getPlayerBestsUrl()
        console.debug(`Got startUrl=${startUrl}`)

        let counter = 1
        let nextPageUrl = startUrl
        do {
            const [url, bests] = await this.fetchBests(nextPageUrl)
            console.info(`${nextPageUrl}: fetched ${counter}`)

            yield* bests
            ++counter
            nextPageUrl = url
        } while (nextPageUrl)
    }
}
