var lightShow = {
    rpi: null,
    relay: null,
    init: function(options) {
        this.rpi = options.rpi;
        this.relay = options.relay;
    },
    load: function (name) {
        var showName = name || "show1",
            json = require('../lightShows/' + showName + '.json');

        _.each(json.shows, function (value, _index) {
            _.each(value.steps, function (milis, index) {
                setTimeout(function () {

                    var pin = value.pinNumber;
                    if ((index + 1) % 2 == 0) {
                        this.relay.toggle(pin, 0);
                    }
                    else {
                        this,relay.toggle(pin, 1);
                    }
                }.bind(this), milis);
            }.bind(this));
        }.bind(this));
    }
};

module.exports = lightShow;