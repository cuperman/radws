const usage = 'usage: jeffws-service <command> [<args>]';

module.exports = function() {
  return new Promise(resolve => {
    resolve({
      message: usage
    });
  });
};
