var spawn = require('child_process').spawn;

var MusicController = function (config, randomIndex) {
    this.config = config;
    this.index = randomIndex;
    this.currentSong = null;
};

MusicController.prototype.play = function (index) {

    index = (index) ? index : this.index;

    this.stop();

    this.currentSong = spawn("sudo", ["python", this.config.basePath + "/py/synchronized_lights.py", "--file", this.config.basePath + "/mp3/" + this.config.songs[index] + '.mp3']).on('close', function (msg) {
        console.log(msg);
    }).on('error', function(err) {
        console.log(err);
    });

    return this.currentSong;
};


MusicController.prototype.booked = function () {

    this.stop();

    this.currentSong = spawn("sudo", ["python", this.config.basePath + "/py/synchronized_lights.py", "--file", this.config.basePath + "/mp3/" + this.config.appointmentSong + '.mp3']).on('close', function (msg) {
        console.log(msg);
    }).on('error', function(err) {
        console.log(err);
    });

    return this.currentSong;
};

MusicController.prototype.stop = function() {
    if(this.currentSong) {
        this.currentSong.kill();
    }
};

MusicController.prototype.next = function () {
    console.log('pre next', this.index);

    if (this.index + 1 > this.config.songs.length) {
        this.index = 0;
        console.log('index rest', this.index);
        return this.index;
    }

    else {
        console.log('next index', this.index + 1);
        return this.index++;
    }
};

module.exports = MusicController;