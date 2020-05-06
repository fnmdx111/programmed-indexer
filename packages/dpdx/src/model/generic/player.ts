import {Chart, difficultyShorthandOrder} from "./meta"

export type LampType = "NO_PLAY" | "ASSIST_CLEAR" | "EASY_CLEAR" | "CLEAR" | "HARD_CLEAR" | "EX_HARD_CLEAR"
    | "FULL_COMBO" | "FAILED"
export type ServiceType = "573" | "Arcana"

export function lampOrder(lamp: LampType): number {
    const lamps: LampType[] = ["NO_PLAY", "FAILED", "ASSIST_CLEAR", "EASY_CLEAR", "CLEAR", "HARD_CLEAR", "EX_HARD_CLEAR", "FULL_COMBO"]
    return lamps.indexOf(lamp)
}

export interface PlayerBest {
    readonly chart: Chart
    readonly server: ServiceType
    readonly lamp: LampType
    readonly ex_score: number
    readonly miss_count?: number
    readonly timestamp: Date
}

function cmp<T>(v1: T | undefined, v2: T | undefined): -1 | 0 | 1 {
    if (!v1) {
        return 1
    } else if (!v2) {
        return -1
    } else {
        return v1 === v2 ? 0 : (v1 < v2 ? -1 : 1)
    }
}

type FieldMapper<T> = (t: T) => string | number | undefined;
class ChainedCmp<T> {
    private readonly criterionMappers: FieldMapper<T>[]
    private readonly i1: T;
    private readonly i2: T;

    constructor(i1: T, i2: T) {
        this.i1 = i1
        this.i2 = i2
        this.criterionMappers = []
    }

    cmp(): -1 | 0 | 1 {
        const mapper = this.criterionMappers.splice(0, 1)[0]
        if (!mapper) {
            return 0
        } else {
            const v1 = mapper(this.i1)
            const v2 = mapper(this.i2)
            return v1 === v2 ? this.cmp() : cmp(v1, v2)
        }
    }

    compare(mapper: FieldMapper<T>): this {
        this.criterionMappers.push(mapper)

        return this
    }

}

export function playerBestCmp(b1: PlayerBest, b2: PlayerBest): -1 | 0 | 1 {
    return new ChainedCmp(b1, b2)
        .compare(best => difficultyShorthandOrder(best))
        .compare(best => best.chart.level)
        .compare(best => best.chart.music.folder)
        .compare(best => lampOrder(best.lamp))
        .compare(best => best.ex_score)
        .compare(best => best.miss_count)
        .compare(best => best.chart.music.title.toLocaleLowerCase())
        .compare(best => best.chart.music.artist)
        .compare(best => best.chart.music.genre)
        .compare(best => best.server)
        .cmp()
}
