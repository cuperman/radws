const yaml = require('js-yaml');
const fs = require('fs');
const filter = require('lodash/filter');

function parseTemplate(filePath) {
  return new Promise((resolve, reject) => {
    try {
      const template = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
      resolve(template);
    } catch(error) {
      reject(error);
    }
  });
}

function parseFunctions(filePath) {
  return new Promise(resolve => {
    return parseTemplate(filePath)
      .then(template => {
        const resources = template.Resources;
        const functions = filter(resources, resource => {
          return (resource.Type === 'AWS::Serverless::Function');
        });
        resolve(functions);
      });
  });
}

function parseRoutes(filePath) {
  return new Promise(resolve => {
    parseFunctions(filePath)
      .then(functions => {
        const routes = functions.map(fn => {
          const properties = fn.Properties;
          const resourceProperties = properties.Events.Resource.Properties;
          return { method: resourceProperties.Method, path: resourceProperties.Path, handler: properties.Handler };
        });
        resolve(routes);
      });
  });
}

module.exports = parseRoutes;
