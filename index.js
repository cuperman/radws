const express = require('express');
const bodyParser = require('body-parser');

const photos = require('./app/handlers/photo_handlers');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const handleResponse = (fn) => {
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

app.get    ('/api/photos',     handleResponse(photos.index));
app.post   ('/api/photos',     handleResponse(photos.create));
app.get    ('/api/photos/:id', handleResponse(photos.show));
app.put    ('/api/photos/:id', handleResponse(photos.update));
app.patch  ('/api/photos/:id', handleResponse(photos.update));
app.delete ('/api/photos/:id', handleResponse(photos.destroy));

app.listen(3000);
