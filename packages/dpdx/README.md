What
----

Previously shiidx, but better and rewritten.

* Fetch score from Arcana.
* Transform score from E-Amusement CSV (need premium course).
* Output into (source-agnostic) CSV, this means you should be able to mix best scores from different sources (currently Arcana and E-Amusement).

Next up
----

* Diff `PlayerBest` objects and persist.
* Electron GUI?
* Tests?

How-to
----

### CLI

Run `npm run cli:run -- --help`.

E.g. `npm run cli:run -- --service arcana -s false`

When you run Arcana, you have to have a `config.json` file in your current working directory with the following content:

```json
{
    "token": "<your Arcana token>",
    "baseUrl": "<Arcana API base URL>",
    "version": <a number denoting the version, e.g. 26>
}
```
