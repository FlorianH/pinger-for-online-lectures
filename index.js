const Ping = require("ping-lite");
const chalk = require("chalk");
const fs = require('fs');

let config;
try {
  config = require('./config.json');
} catch (error) {
  console.error("Error: config.json file not found. Please create a config.json file with the appropriate configuration.");
  process.exit(1);
}

const maxLength = process.stdout.columns;
const maxPingTime = 200;

const msSlow = 100;
const msMiddle = 35;

const generateLine = (prefix, milliseconds) => {
    const percentageOfMax = (milliseconds) ? Math.min(1, milliseconds / maxPingTime) : 1;
    const msRounded = Math.round(milliseconds);
    const barLength = Math.max(0, Math.floor(percentageOfMax * maxLength) - prefix.length - msRounded.toString().length - 4);

    const bar = " ".repeat(barLength);

    let coloredText = `${prefix}${bar} ${msRounded}ms\n`;

    if (milliseconds === 0 || isNaN(milliseconds)) {
        coloredText = `${prefix}${bar}💀\n`;
        coloredText = chalk[config.colors.offline].black(coloredText);
    } else if (milliseconds > msSlow) {
        coloredText = chalk[config.colors.slow](coloredText);
    } else if (milliseconds > msMiddle) {
        coloredText = chalk[config.colors.middle].black(coloredText);
    } else {
        coloredText = chalk[config.colors.fast](coloredText);
    }

    return coloredText;
};

const writeLine = (line) => {
    // process.stdout.clearLine();
    // process.stdout.cursorTo(0);
    process.stdout.write(line);
};

const ping = new Ping("8.8.8.8");
var i = 0; // dots counter
setInterval(function() {
    ping.send(function(err, ms) {
        writeLine(generateLine(ping._host, ms));
    });
}, 500);
