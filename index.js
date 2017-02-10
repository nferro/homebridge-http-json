var Service, Characteristic;
var request = require('request');

const DEF_MIN_TEMPERATURE = -100,
      DEF_MAX_TEMPERATURE = 100,
      DEF_TIMEOUT = 5000;

module.exports = function(homebridge){
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
}

HttpAccessory.prototype = {
	identify: function(callback) {
		this.log("Identify requested!");
		callback();
	},

	getServices: function() {
		this.log("getServices")
		var informationService = new Service.AccessoryInformation();

		informationService
			.setCharacteristic(Characteristic.Manufacturer, "Nuno Ferro")
			.setCharacteristic(Characteristic.Model, "HTTP JSON")
			.setCharacteristic(Characteristic.SerialNumber, "ACME#1")

		if (this.service == "Thermostat") {

			var services = [informationService];

			for (var i = this.sensors.length - 1; i >= 0; i--) {
			
			    var ops = {
					  uri:    this.url,
					  method: "GET",
					  timeout: DEF_TIMEOUT
                };
				let sensor = this.sensors[i];

				this.log("Setting up: " + sensor.name);

				newService = new Service[sensor.service](sensor.name);
				newService
				.getCharacteristic(Characteristic[sensor.caractheristic])
				.on('get', function(callback) {
					request(ops, (error, res, body) => {
						var value = null;
						if (error) {
							console.log('HTTP bad response (' + ops.uri + '): ' + error.message);
						} else {
							try {
								var chunk = JSON.parse(body)
								value = eval("chunk." + sensor.field);
								if (value < this.minTemperature || value > this.maxTemperature || isNaN(value)) {
									throw "Invalid value received";
								}
								// console.log('HTTP successful response: ' + body);
								console.log(sensor.name + " value : " + value);
							} catch (parseErr) {
								console.log('Error processing received information: ' + parseErr.message);
								error = parseErr;
							}
						}
						callback(error, value);
					});
				})
				services.push(newService);
			}

			return services;
		}
	}
};


