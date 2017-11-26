const mockLambdaProxy = (fn) => {
  return (req, res) => {
    const event = {
      pathParameters: req.params,
      body: JSON.stringify(req.body)
    };
    const context = {};
    return fn(event, context, (errorMessage, response) => {
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
};

module.exports = mockLambdaProxy;
