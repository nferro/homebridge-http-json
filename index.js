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
            .setCharacteristic(Characteristic.Manufacturer, "Nuno Ferro")
            .setCharacteristic(Characteristic.Model, "HTTP JSON")
            .setCharacteristic(Characteristic.SerialNumber, "ACME#1")

        this.log("Load Service: " + this.service)
        var services = [informationService];

        for (var i = this.sensors.length - 1; i >= 0; i--) {
            let sensor = this.sensors[i];
            let url = this.url;
            this.log("Setting up: " + sensor.name);

            this.log("service: " + sensor.service)
            this.log("name: " + sensor.name)
            newService = new Service[sensor.service](sensor.name);
            newService.getCharacteristic(Characteristic[sensor.characteristic])
                .on('get', function(callback) {
                    console.log(sensor.name + " Triggered");
                    superagent.get(url).end(function(err, res) {
                        if (res && res.body[sensor.field]) {
                            callback(null, res.body[sensor.field]);
                        } else {
                            callback(null, null);
                        }
                    });
                })
            services.push(newService);
        }

        return services;
    }
};