var Cylon = require('cylon'),
    config = require('./config/config.json'),
    socket = require('socket.io-client')(config.url),
    _ = require('underscore'),
    relay = require('./lib/relay'),
    lightShow = require('./lib/lightShow');

// define the robot
var robot = Cylon.robot({
    // change the port to the correct one for your Raspberry Pi
    rpi: null,
    connections: {
        raspi: {adaptor: 'raspi'}
    },
    devices: {
        led: {driver: 'led', pin: 13}
    },
    work: function (rpi) {

        relay.init({
            rpi: rpi
        });

        lightShow.init({
            rpi: rpi,
            relay: relay
        });

        this.init({
            rpi: rpi
        });

    },
    init: function (options) {
        this.rpi = options.rpi;
        this.isRunning = false;

        socket.on('connect', function () {
            console.log('connected');
        }.bind(this));

        // For testing purposes
        setTimeout(function () {
            lightShow.load();
        }.bind(this), 3000);

        socket.on(config.bookEvent, function () {
            relay.toggle(13, 1);

            setTimeout(function () {
                relay.toggle(13, 0);
            }.bind(this), config.duration);
        }.bind(this));

    }
});

// connect to the Raspberry Pi and start working 
robot.start();
