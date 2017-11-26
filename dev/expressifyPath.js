const AWS_VAR_GLOBAL = /\{(\w+)\}/g;
const AWS_VAR_SINGLE = /\{(\w+)\}/;

module.exports = path => {
  const match = path.match(AWS_VAR_GLOBAL);

  let expressPath = path;
  if (match) {
    match.forEach(variable => {
      const value = variable.match(AWS_VAR_SINGLE)[1];
      expressPath = expressPath.replace(variable, `:${value}`);
    });
  }

  return expressPath;
};
