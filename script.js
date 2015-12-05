var Cylon = require('cylon'),
    config = require('./config/config.json'),
    socket = require('socket.io-client')(config.url),
    _ = require('underscore');
 
// define the robot 
var robot = Cylon.robot({
  // change the port to the correct one for your Raspberry Pi
  rpi: null, 
  connections: {
    raspi: { adaptor: 'raspi' }
  },
  devices: {
    led: { driver: 'led', pin: 13 }
  },
  init: function(rpi) {
	this.rpi = rpi;
	this.isRunning = false;
	socket.on('connect', function() {
		console.log('connected');
		//my.led.toggle();	
	}.bind(this));

	setTimeout(function() {
		this.loadShow();
	}.bind(this), 3000);

 	socket.on(config.bookEvent, function() {
        	this.toggleRelay(13,1);

		setTimeout(function() {
			this.toggleRelay(13,0);
		}.bind(this), config.duration);
        }.bind(this));
  },
  toggleRelay: function(togglePin, value) {

console.log(togglePin, value);
	if(value === 1) {
                this.rpi.led.turnOn();
        }       
        else
        {
                this.rpi.led.turnOff();
        }
  },
  lightShow: function() {
	this.isRunning = true;

	

	this.isRunning = false;
  },
  loadShow: function(name) {
	var showName = name || "show1",
	    json = require('./lightShows/' + showName + '.json');

	_.each(json.shows, function(value, _index) {
		_.each(value.steps, function(milis, index) {
			setTimeout(function() {

				var pin = value.pinNumber;
				if((index + 1) % 2 == 0) {
					this.toggleRelay(pin, 0);	
				}
				else
				{
					this.toggleRelay(pin, 1);
				}
			}.bind(this), milis);
		}.bind(this));
	}.bind(this));
  },
  work: function(rpi) {

	this.init(rpi);

    //every((1).second(), my.led.toggle);
  }
})

// connect to the Raspberry Pi and start working 
robot.start();
