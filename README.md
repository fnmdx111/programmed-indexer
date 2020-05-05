# programmed-indexer

Read/fetch player best scores from Arcana and E-Amusement services into homogeneous data for further analysis.

# How-to

## Download Arcana scores into a CSV

1. Install Node.js 12+
2. Clone the repository
3. Create a JSON file anywhere you like with the following content

        {
            "token": "<your arcana token>",
            "baseUrl": "<arcana base url>",
            "version": 26
        }

3. In the root of the repo, run

        npm install
        npx lerna run bootstrap
        npx lerna run cli:run --service arcana --input <path/to/config.json> --outputFormat csv
