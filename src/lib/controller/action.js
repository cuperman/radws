const jsonResponse = require('../formatters/json_response');

const formatRequest = (event) => {
  let request = {};

  request.params = event.pathParameters || {};
  request.body = event.body ? JSON.parse(event.body) : '';

  return request;
}

exports.lambdaHandler = (actionCallback) => {
  return (event, context, lambdaCallback) => {
    const request = formatRequest(event);

    // TODO: validate CSRF

    const render = data => lambdaCallback(null, jsonResponse(data.status, data.body, data.headers));

    new Promise((resolve, reject) => {
      actionCallback(request, render);
    })
    .catch(error => {
      lambdaCallback(null, jsonResponse(error.status, { error: error.message }));
    });
  };
};
