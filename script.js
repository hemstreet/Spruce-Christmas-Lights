var Cylon = require('cylon'),
    config = require('./config/config.json'),
    socket = require('socket.io-client')(config.url),
    _ = require('underscore'),
    relay = require('./lib/relay'),
    lightShow = require('./lib/lightShow'),
    MusicController = require('./lib/musicController'),
    musicController = new MusicController(config, Math.round(Math.random() * (config.songs.length - 1)));

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

        this.currentSong = this.playNext();

        socket.on(config.bookEvent, function () {

            if(!this.isRunning) {

                this.isRunning = true;
                this.currentSong.kill();
                this.currentSong = musicController.booked();

                setTimeout(function() {
                    this.isRunning = false;
                    this.currentSong.kill();
                    this.playNext();
                }.bind(this), 1000 * 30);

            }

        }.bind(this));

    },
    playNext: function() {
        this.currentSong = musicController.play(musicController.next()).on('close', function() {
            console.log('closed playNext');
            this.playNext()
        }.bind(this));
    }
});

// connect to the Raspberry Pi and start working 
robot.start();
