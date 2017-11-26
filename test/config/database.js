const STACKS_FILE = '../../package/stacks.test.json';
const stacks = require(STACKS_FILE);

function getOutputs() {
  if (stacks.Stacks && stacks.Stacks.length > 0) {
    return stacks.Stacks[0].Outputs;
  } else {
    return [];
  }
}

function flattenOutputs() {
  const outputs = getOutputs();
  return outputs.reduce((flat, o) => {
    return Object.assign(flat, { [o.OutputKey]: o.OutputValue });
  }, {});
}

module.exports = flattenOutputs();
