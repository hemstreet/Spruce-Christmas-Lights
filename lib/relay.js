var relay = {
    rpi: false,
    init: function(options) {
      this.rpi = options.rpi;
    },
    toggle: function (togglePin, value) {

        console.log(togglePin, value);

        if (value === 1) {
            this.rpi.led.turnOn();
        }
        else {
            this.rpi.led.turnOff();
        }
    }
};

module.exports = relay;