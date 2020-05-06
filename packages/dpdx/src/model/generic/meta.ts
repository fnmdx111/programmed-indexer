import {PlayerBest} from "./player"

export type PlayStyle = "DOUBLE" | "SINGLE"
export type Difficulty = "BEGINNER" | "NORMAL" | "HYPER" | "ANOTHER" | "LEGGENDARIA"
export const ALL_DIFFICULTIES: Difficulty[] = ["BEGINNER", "NORMAL", "HYPER", "ANOTHER", "LEGGENDARIA"]

export interface Chart {
    readonly music: Music
    readonly play_style: PlayStyle
    readonly difficulty: Difficulty
    readonly level: number
    readonly notes?: number
    readonly bpm_min?: number
    readonly bpm_max?: number
}

export interface Music {
    readonly folder: number
    readonly title: string
    readonly artist: string
    readonly genre: string
}

const DifficultyShorthand: {[k in Difficulty]: [string, number]} = {
    BEGINNER: ["B", 0x0],
    NORMAL: ["N", 0x1],
    HYPER: ["H", 0x2],
    ANOTHER: ["A", 0x3],
    LEGGENDARIA: ["L", 0x4]
}
const PlayStyleShorthand: {[k in PlayStyle]: [string, number]} = {
    SINGLE: ["SP", 0x00],
    DOUBLE: ["DP", 0x10]
}
export function difficultyShorthand(best: PlayerBest) {
    return PlayStyleShorthand[best.chart.play_style][0] + DifficultyShorthand[best.chart.difficulty][0]
}
export function difficultyShorthandOrder(best: PlayerBest) {
    return PlayStyleShorthand[best.chart.play_style][1] | DifficultyShorthand[best.chart.difficulty][1]
}
