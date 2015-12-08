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

        this.currentSong = exec("sudo python /home/pi/Development/lightshowpi/py/start_music_and_lights.py --playlist=/home/pi/Development/lightshowpi/.playlist", function (error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        }.bind(this));

        socket.on(config.bookEvent, function () {

            if(!this.isRunning) {

                this.isRunning = true;
                this.currentSong.kill();
                this.currentSong = null;

                this.currentSong = exec("sudo python /home/pi/Development/lightshowpi/py/synchronized_lights.py --file=/home/pi/Development/lightshowpi/" + config.appointmentSong, function (error, stdout, stderr) {
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                }.bind(this));

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
