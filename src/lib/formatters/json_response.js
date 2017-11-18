const httpResponse = require('./http_response');

module.exports = (statusCode = 200, body = '', headers = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json'
  };
  const jsonBody = body ? JSON.stringify(body) : body;

  return httpResponse(statusCode, jsonBody, Object.assign({}, defaultHeaders, headers));
};
