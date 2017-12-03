const yaml = require('js-yaml');
const fs = require('fs');
const filter = require('lodash/filter');
const each = require('lodash/each');

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

  let routes = [];
  functions.forEach(fn => {
    const properties = fn.Properties;
    const events = properties.Events;
    each(events, event => {
      const eventProperties = event.Properties;
      routes.push({ method: eventProperties.Method, path: eventProperties.Path, handler: properties.Handler });
    });
  });
  return routes;
}

module.exports = parseRoutes;
