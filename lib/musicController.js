var spawn = require('child_process').spawn;

var MusicController = function (config, randomIndex) {
    this.config = config;
    this.index = randomIndex;
    this.currentSong = null;

};

MusicController.prototype.play = function (index) {

    this.stop();

    console.log('play', index, this.config.songs[index]);
    this.currentSong = spawn("sudo", ["python", this.config.basePath + "/py/synchronized_lights.py", "--file", this.config.basePath + "/mp3/" + this.config.songs[index] + '.mp3']);

    return this.currentSong;
};


MusicController.prototype.booked = function () {

    this.stop();

    console.log('play booked song', this.config.appointmentSong);
    this.currentSong = spawn("sudo", ["python", this.config.basePath + "/py/synchronized_lights.py", "--file", this.config.basePath + "/mp3/" + this.config.appointmentSong + '.mp3']);

    return this.currentSong;
};

MusicController.prototype.stop = function() {
    if(this.currentSong) {
        console.log('kill', this.index);
        this.currentSong.kill();
    }
};

MusicController.prototype.next = function () {
    console.log('pre next', this.index);

    if (this.index + 1 > this.config.songs.length) {
        console.log('index rest', this.index);
        return this.index;
    }

    else {
        console.log('next index', this.index + 1);
        return this.index++;
    }
};

module.exports = MusicController;