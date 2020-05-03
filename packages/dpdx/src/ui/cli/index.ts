import yargs from "yargs"
import {PlayStyle} from "../../model/generic/meta"
import {playerBestCmp} from "../../model/generic/player"
import {getIndexer, Service} from "./indexer"
import {OutputFormat, performConsoleTabling, performSave} from "./output"

const argv = yargs.options({
    service: {
        choices: ["arcana", "konmai", "local-json"] as Service[],
        demandOption: true
    },
    input: {
        type: "string",
        alias: "i"
    },
    playStyle: {
        choices: ["SINGLE", "DOUBLE"] as PlayStyle[]
    },
    saveResult: {
        type: "boolean",
        alias: "s",
        default: true
    },
    output: {
        type: "string",
        alias: "o"
    },
    outputFormat: {
        choices: ["json", "csv"] as OutputFormat[],
        default: "json" as OutputFormat
    },
    echo: {
        type: "boolean",
        default: true,
        description: "Whether to print a table of what was indexed to the console"
    }
}).argv

async function main() {
    const indexer = getIndexer(argv.service, {input: argv.input, playStyle: argv.playStyle})

    const data = []
    for await (const best of indexer.index()) {
        data.push(best)
    }
    data.sort(playerBestCmp)

    if (argv.saveResult && argv.service !== "local-json") {
        performSave(data, {
            output: argv.output,
            outputFormat: argv.outputFormat,
            service: argv.service
        })
    }

    if (argv.echo) {
        performConsoleTabling(data)
    }
}

main()
