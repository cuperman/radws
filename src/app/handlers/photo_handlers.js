const Photo = require('../models/photo');

const {
  HTTP_CREATED,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_NO_CONTENT,
  HTTP_NOT_FOUND,
  HTTP_OK,
  HTTP_UNPROCESSABLE_ENTITY
} = require('../../lib/http/status_codes');

const jsonResponse = require('../../lib/formatters/json_response');

const processRequest = (event) => {
  // TODO: validate CSRF
  return new Promise((resolve, reject) => {
    let req = {};

    req.params = event.pathParameters || {};
    req.body = event.body ? JSON.parse(event.body) : '';

    resolve(req);
  });
};

// GET /photos
exports.index = (event, context, callback) => {
  processRequest(event)
    .then(req => {
      return new Promise((resolve, reject) => {
        Photo.all()
          .then(data => resolve(Object.assign({}, req, { photos: data.Items })))
          .catch(error => reject({ status: HTTP_INTERNAL_SERVER_ERROR }));
      });
    })
    .then(req => {
      callback(null, jsonResponse(HTTP_OK, req.photos));
    })
    .catch(error => {
      callback(null, jsonResponse(error.status));
    });
}

// GET /photos/:id
exports.show = (event, context, callback) => {
  processRequest(event)
    .then(req => {
      return new Promise((resolve, reject) => {
        Photo.find(req.params.id)
          .then(data => resolve(Object.assign({}, req, { photo: data.Item })))
          .catch(error => reject({ status: HTTP_NOT_FOUND }))
      });
    })
    .then(req => {
      callback(null, jsonResponse(HTTP_OK, req.photo));
    })
    .catch(error => {
      callback(null, jsonResponse(error.status));
    });
}

// POST /photos
exports.create = (event, context, callback) => {
  processRequest(event)
    .then(req => {
      return new Promise((resolve, reject) => {
        Photo.create(req.body.photo)
          .then(data => resolve(Object.assign({}, req, { photo: data.Item })))
          .catch(error => reject({ status: HTTP_UNPROCESSABLE_ENTITY, message: 'Validation error' }));
      });
    })
    .then(req => {
      callback(null, jsonResponse(HTTP_CREATED, req.photo));
    })
    .catch(error => {
      callback(null, jsonResponse(error.status, { message: error.message }));
    });
}

// PATCH/PUT /photos/:id
exports.update = (event, context, callback) => {
  processRequest(event)
    .then(req => {
      return new Promise((resolve, reject) => {
        Photo.update(req.params.id, req.body.photo)
          .then(data => resolve(Object.assign({}, req, { photo: data.Item })))
          .catch(error => {
            reject({ status: HTTP_NOT_FOUND });
            reject({ status: HTTP_UNPROCESSABLE_ENTITY, message: 'Validation error' });
          });
      })
    })
    .then(req => {
      callback(null, jsonResponse(HTTP_OK, req.photo));
    })
    .catch(error => {
      callback(null, jsonResponse(error.status, { message: error.message }));
    });
}

// DELETE /photos/:id
exports.destroy = (event, context, callback) => {
  processRequest(event)
    .then(req => {
      return new Promise((resolve, reject) => {
        Photo.destroy(req.params.id)
          .then(data => resolve())
          .catch(error => reject({ status: HTTP_NOT_FOUND }))
      });
    })
    .then(req => {
      callback(null, jsonResponse(HTTP_NO_CONTENT));
    })
    .catch(error => {
      callback(null, jsonResponse(error.status));
    });
}
