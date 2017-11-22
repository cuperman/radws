const console = require('console');
const jsonResponse = require('./json_response');
const { HTTP_INTERNAL_SERVER_ERROR, HTTP_NOT_FOUND } = require('./status_codes');
const { ItemNotFound } = require('../document/errors');

const formatRequest = (event) => {
  let request = {};

  request.params = event.pathParameters || {};
  request.body = event.body ? JSON.parse(event.body) : '';

  return request;
};

module.exports = (actionCallback) => {
  return (event, context, lambdaCallback) => {
    const request = formatRequest(event);

    // TODO: validate CSRF

    const render = data => lambdaCallback(null, jsonResponse(data.status, data.body, data.headers));
    const actionPromise = actionCallback(request, render);
    if (!actionPromise || !actionPromise.catch) {
      console.warn('Return a promise in your action!!');
    } else {
      actionPromise.catch(error => {
        if (error instanceof ItemNotFound) {
          lambdaCallback(null, jsonResponse(HTTP_NOT_FOUND));
        } else {
          console.error('Unhandled action error', error);
          lambdaCallback(null, jsonResponse(HTTP_INTERNAL_SERVER_ERROR));
        }
      });
    }
  };
};
