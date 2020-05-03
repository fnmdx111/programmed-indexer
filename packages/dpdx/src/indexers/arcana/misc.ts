/* eslint-disable @typescript-eslint/no-explicit-any */

import {Chart, Difficulty, Music} from "../../model/generic/meta"
import {PlayerBest} from "../../model/generic/player"

function chartDifficulty(raw: string): Difficulty {
    switch (raw) {
    case "BLACK":
        return "LEGGENDARIA"
    case "BEGINNER":
    case "NORMAL":
    case "HYPER":
    case "ANOTHER":
        return raw
    default:
        throw new Error("Invalid difficulty " + raw)
    }
}

export function rawChartToChart(raw: any, music: Music): Chart {
    return {
        bpm_max: raw.bpm_max,
        bpm_min: raw.bpm_min,
        difficulty: chartDifficulty(raw.difficulty),
        level: raw.rating,
        music,
        notes: raw.notes,
        play_style: raw.play_style
    }
}

export function rawMusicToMusic(raw: any): Music {
    return {
        artist: raw.artist,
        folder: raw.folder,
        genre: raw.genre,
        title: raw.title
    }
}

export function rawPlayerBestToPlayerBest(raw: any, chart: Chart): PlayerBest {
    return {
        chart: chart,
        ex_score: raw.ex_score,
        lamp: raw.lamp,
        miss_count: raw.miss_count,
        server: "Arcana",
        timestamp: new Date(raw.timestamp)
    }
}

export function makeIndex<T, K>(items: T[], attr: (i: T) => K): Map<K, T> {
    return new Map(items.map(i => [attr(i), i]))
}
