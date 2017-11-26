const yaml = require('js-yaml');
const fs = require('fs');
const filter = require('lodash/filter');

function parseTemplate(filePath) {
  try {
    return yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
  } catch(error) {
    throw new Error(error);
  }
}

function parseFunctions(filePath) {
  const template = parseTemplate(filePath);
  const resources = template.Resources;
  return filter(resources, resource => {
    return (resource.Type === 'AWS::Serverless::Function');
  });
}

function parseRoutes(filePath) {
  const functions = parseFunctions(filePath);
  return functions.map(fn => {
    const properties = fn.Properties;
    const resourceProperties = properties.Events.Resource.Properties;
    return { method: resourceProperties.Method, path: resourceProperties.Path, handler: properties.Handler };
  });
}

module.exports = parseRoutes;
