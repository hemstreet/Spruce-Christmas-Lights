var Cylon = require('cylon'),
    config = require('./config/config.json'),
    socket = require('socket.io-client')(config.url),
    _ = require('underscore'),
    relay = require('./lib/relay'),
    lightShow = require('./lib/lightShow'),
    spawn = require('child_process').spawn;

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

        var randomIndex = Math.round(Math.random() * (config.songs.length - 1));

        socket.on('connect', function () {
            console.log('connected');
        }.bind(this));

console.log("sudo python " + config.basePath + "/py/synchronized_lights.py " + "--file" + config.basePath + "/mp3/" + config.songs[randomIndex] + '.mp3');

        this.currentSong = spawn("sudo", ["python", config.basePath + "/py/synchronized_lights.py", "--file", config.basePath + "/mp3/" + config.songs[randomIndex] + '.mp3']).on('error', function(err) { console.log(err); });

        this.currentSong.on('close', function() {
            console.log('it\'s closed');
        });

        socket.on(config.bookEvent, function () {

            if(!this.isRunning) {

                this.isRunning = true;
                this.currentSong.kill();
                this.currentSong = null;

                this.currentSong = spawn("sudo", ["python", config.basePath + "/py/synchronized_lights.py", "--file", config.basePath + "/" + config.appointmentSong]).on('error', function(err) { console.log(err); }).on('close', function() {
                    this.currentSong = spawn("sudo", ["python", config.basePath + "/py/synchronized_lights.py", "--file", config.basePath + "/" + config.songs[randomIndex] + '.mp3']).on('error', function(err) { console.log(err); });
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
