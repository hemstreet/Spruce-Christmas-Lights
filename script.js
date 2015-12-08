var Cylon = require('cylon'),
    config = require('./config/config.json'),
    socket = require('socket.io-client')(config.url),
    _ = require('underscore'),
    relay = require('./lib/relay'),
    lightShow = require('./lib/lightShow');

var sys = require('sys');
var spawn = require('child_process').spawn;
var child;

// define the robot
var robot = Cylon.robot({
    // change the port to the correct one for your Raspberry Pi
    rpi: null,
    currentSong: null,
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

        this.currentSong = spawn("sudo python /home/pi/Development/lightshowpi/py/synchronized_lights.py", ["--playlist", "/home/pi/Development/lightshowpi/.playlist"]).on('error', function(err) { console.log(err); });

        socket.on(config.bookEvent, function () {

            if(!this.isRunning) {

                this.isRunning = true;
                this.currentSong.kill();
                this.currentSong = null;

                this.currentSong = spawn("sudo python /home/pi/Development/lightshowpi/py/synchronized_lights.py --file=/home/pi/Development/lightshowpi/" + config.appointmentSong).on('error', function(err) { console.log(err); });

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
