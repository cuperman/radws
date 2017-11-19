const action = require('../../lib/controller/action');
const Photo = require('../models/photo');

const {
  HTTP_CREATED,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_NO_CONTENT,
  HTTP_NOT_FOUND,
  HTTP_OK,
  HTTP_UNPROCESSABLE_ENTITY
} = require('../../lib/http/status_codes');

// GET /photos
exports.index = action.lambdaHandler((request, render) => {
  Photo.all()
    .then(data => {
      render({ status: HTTP_OK, body: data.Items });
    })
    .catch(() => {
      render({ status: HTTP_INTERNAL_SERVER_ERROR });
    });
});

// GET /photos/:id
exports.show = action.lambdaHandler((request, render) => {
  Photo.find(request.params.id)
    .then(data => {
      render({ status: HTTP_OK, body: { photo: data.Item } });
    })
    .catch(() => {
      render({ status: HTTP_NOT_FOUND });
    });
});

// POST /photos
exports.create = action.lambdaHandler((request, render) => {
  Photo.create(request.body.photo)
    .then(data => {
      render({ status: HTTP_CREATED, body: { photo: data.Item } });
    })
    .catch(() => {
      render({ status: HTTP_UNPROCESSABLE_ENTITY, body: { error: 'Validation error' } });
    });
});

// PATCH/PUT /photos/:id
exports.update = action.lambdaHandler((request, render) => {
  Photo.update(request.params.id, request.body.photo)
    .then(data => {
      render({ status: HTTP_OK, body: { photo: data.Item } });
    })
    .catch(() => {
      // TODO: handle the case where item is not found
      // render({ status: HTTP_NOT_FOUND });
      render({ status: HTTP_UNPROCESSABLE_ENTITY, body: { error: 'Validation error' } });
    });
});

// DELETE /photos/:id
exports.destroy = action.lambdaHandler((request, render) => {
  Photo.destroy(request.params.id)
    .then(() => {
      render({ status: HTTP_NO_CONTENT });
    })
    .catch(() => {
      render({ status: HTTP_NOT_FOUND });
    });
});
