const console = require('console');

const command = process.argv[2];
const args = Array.prototype.slice.call(process.argv, 3);

let commandFn;

switch (command) {
case 'init':
  commandFn = require('./commands/init');
  break;
case 'list':
  commandFn = require('./commands/list');
  break;
case 'help':
default:
  commandFn = require('./commands/help');
}

commandFn(args)
  .then(output => {
    const message = output && output.message;

    if (message) {
      console.log(message);
    }
    process.exit(0);
  })
  .catch(error => {
    const code = error.code || 1;
    const message = error.message || 'Unknown error';

    console.error(message);
    process.exit(code);
  });
