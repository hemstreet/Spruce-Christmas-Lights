var config = require('./config/config.json'),
    socket = require('socket.io-client')(config.url),
    _ = require('underscore'),
    MusicController = require('./lib/musicController'),
    musicController = new MusicController(config, Math.round(Math.random() * (config.songs.length - 1)));

// define the robot
var lights = {
    currentSong: null,
    ignoreNextClose: false,
    init: function (options) {
        this.isRunning = false;

        socket.on('connect', function () {
            console.log('connected');
            this.playNext();
        }.bind(this));

        socket.on(config.bookEvent, function () {

            if(!this.isRunning) {

                this.isRunning = true;
                this.ignoreNextClose = true;
                musicController.booked();

                setTimeout(function() {
                    this.isRunning = false;
                    this.ignoreNextClose = true;
                    this.playNext();
                }.bind(this), 1000 * 30);

            }

        }.bind(this));

        socket.on('disconnect', function() {
            musicController.stop();
        });

    },
    playNext: function() {
        console.log('start of play next');
        musicController.play(musicController.next()).on('close', function() {
            if(!this.ignoreNextClose) {
                console.log('closed not ignored');
                this.playNext();
            }
            else
            {
                console.log('close ignored');
            }
            this.ignoreNextClose = false;
        }.bind(this));
    }
};

// connect to the Raspberry Pi and start working
lights.init();
