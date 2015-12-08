var Cylon = require('cylon'),
    config = require('./config/config.json'),
    socket = require('socket.io-client')(config.url),
    _ = require('underscore'),
    relay = require('./lib/relay'),
    lightShow = require('./lib/lightShow');

var sys = require('sys');
var exec = require('child_process').exec;
var child;

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

        child = exec("sudo python /home/pi/Development/lightshowpi/py/synchronized_lights.py --file=/home/pi/Development/lightshowpi/east-coast.mp3", function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });

        socket.on(config.bookEvent, function () {

            if(!this.isRunning) {

                this.isRunning = true;

                lightShow.load('show2')
                .then(function() {
                    this.isRunning = false;
                }.bind(this));
            }

        }.bind(this));

    }
});

// connect to the Raspberry Pi and start working 
robot.start();
