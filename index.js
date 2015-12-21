var Service, Characteristic;
var superagent = require('superagent');

module.exports = function(homebridge){
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-http-thermostat", "http-thermostat", HttpAccessory);
}

function HttpAccessory(log, config) {
	this.log = log;

	this.temperature_url = config["temperature_url"];
	this.humidity_url = config["humidity_url"];
	this.service = config["service"];
	this.name = config["name"];
}

HttpAccessory.prototype = {
  getTemperature: function(callback) {
    console.log("Temperature Triggered");

    superagent.get(this.temperature_url).end(function(err, res){
      if (res.body.confirmation) {
        callback(null, res.body.result);
      } else {
        callback(null, null);
      }
    });
  },
  getHumidity: function(callback) {
    console.log("Humidity Triggered");
    superagent.get(this.humidity_url).end(function(err, res){
      if (res.body.confirmation) {
        callback(null, res.body.result);
      } else {
        callback(null, null);
      }
    });
  },
	identify: function(callback) {
		this.log("Identify requested!");
		callback();
	},

	getServices: function() {
    var informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Manufacturer, "ACME")
      .setCharacteristic(Characteristic.Model, "Mark I")
      .setCharacteristic(Characteristic.SerialNumber, "ACME#1")

		if (this.service == "Thermostat") {
      temperatureService = new Service.TemperatureSensor("Bedroom Temperature");

      temperatureService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .on('get', this.getTemperature.bind(this));

      humiditySensor = new Service.HumiditySensor();

      humiditySensor
        .getCharacteristic(Characteristic.CurrentRelativeHumidity)
        .on('get', this.getHumidity.bind(this));

			return [informationService, temperatureService, humiditySensor];
		}
	}
};
