const config = require('../util/config');
const { CONFIG_FILE } = require('../util/constants');

module.exports = function(args) {
  return new Promise((resolve, reject) => {
    const data = config.read(CONFIG_FILE);
    const attribute = args[0];

    if (!data) {
      reject({ message: 'Service has not been initialized; nothing to list' });
    } else if (!attribute) {
      resolve({ message: JSON.stringify(data, null, 2) });
    } else if (data[attribute]) {
      resolve({ message: data[attribute] });
    } else {
      reject({ message: `Unknown configuration: ${args[0]}` });
    }
  });
};
