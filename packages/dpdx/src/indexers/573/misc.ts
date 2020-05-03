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
