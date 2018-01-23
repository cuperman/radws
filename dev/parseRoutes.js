const fs = require('fs');
const { reduce, upperFirst, camelCase } = require('lodash');

function parseJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch(error) {
    throw new Error(error);
  }
}

function parseStackOutputs(filePath) {
  const stacksJson = parseJsonFile(filePath) || {};
  const stack = stacksJson.Stacks && stacksJson.Stacks[0];
  const outputs = stack && stack.Outputs || [];

  return reduce(outputs, (accumulator, output) => {
    accumulator[output.OutputKey] = output.OutputValue;
    return accumulator;
  }, {});
}

function parseResources(filePath) {
  const templateJson = parseJsonFile(filePath) || {};
  const resources = templateJson.Resources;

  return reduce(resources, (output, resource, resourceName) => {
    switch (resource.Type) {
      case 'AWS::Lambda::Function':
        output.lambdaFunctions[resourceName] = resource;
        break;
      case 'AWS::ApiGateway::Resource':
        output.apiResources[resourceName] = resource;
        break;
      case 'AWS::ApiGateway::Method':
        output.apiMethods[resourceName] = resource;
        break;
    }
    return output;
  }, {
    lambdaFunctions: {},
    apiResources: {},
    apiMethods: {}
  });
}

function getMethod(apiMethod) {
  return apiMethod.Properties && apiMethod.Properties.HttpMethod;
}

function isRootApiResource(apiResource) {
  const parentId = apiResource.Properties && apiResource.Properties.ParentId;
  return parentId && JSON.stringify(parentId).match(/RootResourceId/);
}

function apiResourceParent(apiResource, allApiResources) {
  const parentId = apiResource.Properties && apiResource.Properties.ParentId;
  const parentResourceName = parentId && parentId.Ref;
  return allApiResources[parentResourceName];
}

function buildPath(apiResource, allApiResources) {
  const pathPart = apiResource.Properties && apiResource.Properties.PathPart;

  if (isRootApiResource(apiResource)) {
    return `/${pathPart}`;
  } else {
    const parentApiResource = apiResourceParent(apiResource, allApiResources);
    const parentPathPart = parentApiResource && buildPath(parentApiResource, allApiResources);
    return `${parentPathPart}/${pathPart}`;
  }
}

function getPath(apiMethod, apiResources) {
  const resourceId = apiMethod.Properties && apiMethod.Properties.ResourceId;
  const apiResourceName = resourceId && resourceId.Ref;
  const apiResource = apiResourceName && apiResources[apiResourceName];

  if (apiResource) {
    return buildPath(apiResource, apiResources);
  }

  return null;
}

function getLambdaFunction(apiMethod, lambdaFunctions) {
  const integration = apiMethod.Properties && apiMethod.Properties.Integration;
  const integrationUri = integration && integration.Uri;
  const lambdaResourceMatch = integrationUri && JSON.stringify(integrationUri).match(/\$\{(\w+).Arn\}/);
  const lambdaResourceName = lambdaResourceMatch && lambdaResourceMatch[1];

  if (lambdaResourceName) {
    return lambdaFunctions[lambdaResourceName];
  }

  return null;
}

function getHandler(apiMethod, lambdaFunctions) {
  const lambdaFunction = getLambdaFunction(apiMethod, lambdaFunctions);

  if (lambdaFunction) {
    return lambdaFunction.Properties && lambdaFunction.Properties.Handler;
  }

  return null;
}

function getEnvironmentValues(variables, outputs) {
  return reduce(variables, (env, variableDef, variableName) => {
    const outputName = variableDef.Ref && upperFirst(camelCase(variableDef.Ref));
    if (outputName && outputs[outputName]) {
      env[variableName] = outputs[outputName];
    }
    return env;
  }, {});
}

function getEnvironmentVariables(apiMethod, lambdaFunctions, outputs) {
  const lambdaFunction = getLambdaFunction(apiMethod, lambdaFunctions);
  const properties = lambdaFunction && lambdaFunction.Properties;
  const variables = properties.Environment && properties.Environment.Variables;

  if (variables) {
    return getEnvironmentValues(variables, outputs);
  }

  return {};
}

function parseRoutes(templateFilePath, stacksFilePath) {
  const { lambdaFunctions, apiResources, apiMethods } = parseResources(templateFilePath);
  const outputs = parseStackOutputs(stacksFilePath);

  return reduce(apiMethods, (routes, apiMethod) => {
    const method = getMethod(apiMethod);
    const path = getPath(apiMethod, apiResources);
    const handler = getHandler(apiMethod, lambdaFunctions);
    const env = getEnvironmentVariables(apiMethod, lambdaFunctions, outputs);

    if (method && path && handler) {
      routes.push({ method, path, handler, env });
    }

    return routes;
  }, []);
}

module.exports = parseRoutes;
