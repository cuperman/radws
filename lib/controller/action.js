const console = require('console');
const jsonResponse = require('../format/json_response');
const { HTTP_INTERNAL_SERVER_ERROR, HTTP_NOT_FOUND } = require('../http/status_codes');
const { ItemNotFound } = require('../db/errors');

const formatRequest = (event) => {
  let request = {};

  request.params = event.pathParameters || {};
  request.body = event.body ? JSON.parse(event.body) : '';

  return request;
};

exports.lambdaHandler = (actionCallback) => {
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
