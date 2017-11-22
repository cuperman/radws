module.exports = (statusCode = 200, body = '', headers = {}) => {
  return {
    statusCode,
    headers,
    body
  };
};
