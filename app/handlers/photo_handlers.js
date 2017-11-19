const action = require('../../lib/controller/action');
const Photo = require('../models/photo');
const { HTTP_CREATED, HTTP_NO_CONTENT, HTTP_OK } = require('../../lib/http/status_codes');

// GET /photos
exports.index = action.lambdaHandler((request, render) => {
  return Photo.all()
    .then(data => {
      render({ status: HTTP_OK, body: data });
    });
});

// GET /photos/:id
exports.show = action.lambdaHandler((request, render) => {
  return Photo.find(request.params.id)
    .then(data => {
      render({ status: HTTP_OK, body: { photo: data } });
    });
});

// POST /photos
exports.create = action.lambdaHandler((request, render) => {
  return Photo.create(request.body.photo)
    .then(data => {
      render({ status: HTTP_CREATED, body: { photo: data } });
    });
});

// PATCH/PUT /photos/:id
exports.update = action.lambdaHandler((request, render) => {
  return Photo.update(request.params.id, request.body.photo)
    .then(data => {
      render({ status: HTTP_OK, body: { photo: data } });
    });
});

// DELETE /photos/:id
exports.destroy = action.lambdaHandler((request, render) => {
  return Photo.destroy(request.params.id)
    .then(() => {
      render({ status: HTTP_NO_CONTENT });
    });
});
