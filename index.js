var Service, Characteristic;
var superagent = require('superagent');

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
  getTemperature: function(callback) {
    this.log("Temperature Triggered");

    superagent.get(this.url).end(function(err, res){
      if (res.body.temperature) {
        callback(null, res.body['temperature']);
      } else {
        callback(null, null);
      }
    });
  },
  getHumidity: function(callback) {
    this.log("Humidity Triggered");
    superagent.get(this.url).end(function(err, res){
      if (res.body.humidity) {
        callback(null, res.body['humidity']);
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
    this.log("getServices")
    var informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Nuno Ferro")
      .setCharacteristic(Characteristic.Model, "HTTP JSON")
      .setCharacteristic(Characteristic.SerialNumber, "ACME#1")

		if (this.service == "Thermostat") {

      var services = [informationService];

      for (var i = this.sensors.length - 1; i >= 0; i--) {
        let sensor = this.sensors[i];
        this.log("Setting up: " + sensor.name);

        newService = new Service[sensor.service](sensor.name);
        newService.getCharacteristic(Characteristic[sensor.caractheristic])
          .on('get', function(callback) {
            console.log(sensor.name + " Triggered");
            superagent.get("http://192.168.1.85/readings").end(function(err, res){
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
	}
};
