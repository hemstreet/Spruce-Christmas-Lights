var spawn = require('child_process').spawn;

var MusicController = function (config, randomIndex) {
    this.config = config;
    this.index = randomIndex;
};

MusicController.prototype.play = function (index) {

    index = (index) ? index : this.index;

    return spawn("sudo", ["python", this.config.basePath + "/py/synchronized_lights.py", "--file", this.config.basePath + "/mp3/" + this.config.songs[index] + '.mp3']).on('error', function (err) {
        console.log(err);
    });
};


MusicController.prototype.booked = function () {
    return spawn("sudo", ["python", this.config.basePath + "/py/synchronized_lights.py", "--file", this.config.basePath + "/mp3/" + this.config.appointmentSong + '.mp3']).on('error', function (err) {
        console.log(err);
    });
};

MusicController.prototype.next = function () {
    if (this.index + 1 > this.config.songs.length) {
        this.index = 0;
        return this.index;
    }

    else {
        return this.index++;
    }
};

module.exports = MusicController;