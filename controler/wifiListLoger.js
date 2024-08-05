const readline = require('readline');

const colors = {
  reset: '\x1b[0m',
  fg: {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    orange: '\x1b[38;5;214m', // ANSI escape code for orange
  },
};

function getColor(signalStrength) {
  switch (signalStrength) {
    case '1':
      return colors.fg.red;
    case '2':
      return colors.fg.red;
    case '3':
      return colors.fg.orange;
    case '4':
      return colors.fg.yellow;
    case '5':
      return colors.fg.green;
    default:
      return colors.reset;
  }
}

exports.logSSIDList = (SSIDlist)=>{
  // Replace empty SSID with "noName" and determine the maximum length of SSID
  SSIDlist.forEach((item) => {
    if (!item.SSID) {
      item.SSID = 'noName';
    }
  });

  const maxLength = Math.max(...SSIDlist.map((item) => item.SSID.length));

  // Log each SSID with the appropriate color and formatting
  SSIDlist.forEach((item, index) => {
    const paddedSSID = item.SSID.padEnd(maxLength);
    const signalStrength = item.Signel_straingth;
    const color = getColor(signalStrength);
    console.log(
      `${index + 1} -> ${color}${paddedSSID}    Signal: ${signalStrength}/5${
        colors.reset
      }`
    );
  });
}