const { isEmpty } = require('lodash');

function mockLambdaEvent(req) {
  // TODO: resource
  const path = req.path = isEmpty(req.path) ? null : req.path;
  const httpMethod = isEmpty(req.method) ? null : req.method;
  const headers = isEmpty(req.headers) ? null : req.headers;
  const queryStringParameters = isEmpty(req.query) ? null : req.query;
  const pathParameters = isEmpty(req.params) ? null : req.params;
  // TODO: stageVariables
  // TODO: requestContext
  const body = isEmpty(req.body) ? null : JSON.stringify(req.body);
  // TODO: isBase64Encoded

  return {
    path,
    httpMethod,
    headers,
    queryStringParameters,
    pathParameters,
    body
  };
}

function mockLambdaContext() {
  return {};
}

function mockLambdaProxy(handler) {
  return (req, res) => {
    const event = mockLambdaEvent(req);
    const context = mockLambdaContext();
    return handler(event, context, (errorMessage, response) => {
      if (errorMessage) {
        return res
          .status(500)
          .send(errorMessage);
      }
      return res
        .status(response.statusCode)
        .set(response.headers)
        .send(response.body);
    });
  };
}

module.exports = {
  mockLambdaEvent,
  mockLambdaContext,
  mockLambdaProxy
};
