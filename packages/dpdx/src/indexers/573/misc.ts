import {LampType} from "../../model/generic/player"

export function lamp(konmaiLamp: string): LampType {
    switch (konmaiLamp) {
    case "NO PLAY":
    case "ASSIST CLEAR":
    case "EASY CLEAR":
    case "CLEAR":
    case "HARD CLEAR":
    case "EX HARD CLEAR":
    case "FAILED":
        return konmaiLamp.replace(" ", "_") as LampType
    case "FULLCOMBO CLEAR":
        return "FULL_COMBO"
    default:
        throw new Error("Invalid Konmai Lamp " + konmaiLamp)
    }
}

export function konmaiLamp(lamp: LampType) {
    switch (lamp) {
    case "NO_PLAY":
    case "ASSIST_CLEAR":
    case "EASY_CLEAR":
    case "CLEAR":
    case "HARD_CLEAR":
    case "EX_HARD_CLEAR":
    case "FAILED":
        return lamp.replace("_", " ") as LampType
    case "FULL_COMBO":
        return "FULLCOMBO CLEAR"
    default:
        throw new Error("Invalid Konmai Lamp " + konmaiLamp)
    }
}

function clean<T>(mapper: (d: string) => T, defaultValue: T): (d?: string) => T {
    return (d?: string) => {
        if (!d || d === "---") {
            return defaultValue
        } else {
            return mapper(d)
        }
    }
}

export const int = clean(d => Number.parseInt(d), 0)
