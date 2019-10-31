# homebridge-http-json

Simple HTTP JSON client for [Homebridge HomeKit](https://github.com/nfarina/homebridge).

Fixed bugs that cannot read sensors except `themostat` and one characteristic limit, now it can read all kind of json sensors with multiple characteristics, but the config structure is changed.

You can refer to `config-section.json` to see how to set it up on you Homebridge `config.json`.

Forked and envolved from [homebridge-http-thermostat](https://github.com/luigifreitas/homebridge-http-thermostat)
