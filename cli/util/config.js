const fs = require('fs');

exports.exists = function(filename) {
  return fs.existsSync(filename);
};

exports.read = function(filename) {
  try {
    const json = fs.readFileSync(filename);
    return JSON.parse(json);
  } catch(err) {
    return null;
  }
};

exports.write = function(filename, config = {}) {
  const json = JSON.stringify(config, null, 2);
  return fs.writeFileSync(filename, json);
};
