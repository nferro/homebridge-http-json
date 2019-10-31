var Service, Characteristic;
var superagent = require('superagent');

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-http-json", "http-json", HttpAccessory);
}

function HttpAccessory(log, config) {
    this.log = log;

    this.url = config["url"];
    this.service = config["service"];
    this.name = config["name"];
    this.sensors = config["sensors"];
    this.log(config)
}

HttpAccessory.prototype = {
    getServices: function() {
        this.log("getServices")
        var informationService = new Service.AccessoryInformation();

        informationService
            .setCharacteristic(Characteristic.Manufacturer, "Chenny Du")
            .setCharacteristic(Characteristic.Model, "HTTP JSON")
            .setCharacteristic(Characteristic.SerialNumber, "whatTheFuck?")

        this.log("Load Service: " + this.service)
        var services = [informationService];

        // console.log(this.sensors)
        for (var i = this.sensors.length - 1; i >= 0; i--) {
            let sensor = this.sensors[i];
            let url = this.url;
            this.log("Setting up: " + sensor.name);

            this.log("service: " + sensor.service)
            this.log("name: " + sensor.name)
            newService = new Service[sensor.service](sensor.name);
            for (var x = sensor.characteristics.length - 1; x >= 0; x--) {
                console.log("Loading: " + sensor.characteristics[x].characteristic);
                // console.log(sensor.characteristics[x]);

                let characteristic = sensor.characteristics[x].characteristic;
                newService.getCharacteristic(Characteristic[sensor.characteristics[x].characteristic])
                    .on('get', function(callback) {
                        console.log(sensor.name + " Triggered");
                        // console.log(sensor);
                        // console.log(sensor.characteristics[i].characteristic)

                        superagent.get(url).end(function(err, res) {
                            let characteristicField = sensor.characteristics.filter(function(y) {return y.characteristic === characteristic;})[0].field
                            // console.log("Get characteristic: " + characteristic);
                            // console.log("Get value: " + characteristicField);

                            if (res && res.body[characteristicField]) {
                                callback(null, res.body[characteristicField]);
                            } else {
                                callback(null, null);
                            }

                        });
                    })

            }
            services.push(newService);
        }

        return services;
    }
};