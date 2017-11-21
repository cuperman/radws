const action = require('../../lib/controller/action');
const Article = require('../models/article');
const { HTTP_CREATED, HTTP_NO_CONTENT, HTTP_OK } = require('../../lib/http/status_codes');

// GET /articles
exports.index = action.lambdaHandler((request, render) => {
  return Article.all()
    .then(data => {
      render({ status: HTTP_OK, body: data });
    });
});

// GET /articles/:id
exports.show = action.lambdaHandler((request, render) => {
  return Article.find(request.params.id)
    .then(data => {
      render({ status: HTTP_OK, body: { article: data } });
    });
});

// POST /articles
exports.create = action.lambdaHandler((request, render) => {
  return Article.create(request.body.article)
    .then(data => {
      render({ status: HTTP_CREATED, body: { article: data } });
    });
});

// PATCH/PUT /articles/:id
exports.update = action.lambdaHandler((request, render) => {
  return Article.update(request.params.id, request.body.article)
    .then(data => {
      render({ status: HTTP_OK, body: { article: data } });
    });
});

// DELETE /articles/:id
exports.destroy = action.lambdaHandler((request, render) => {
  return Article.destroy(request.params.id)
    .then(() => {
      render({ status: HTTP_NO_CONTENT });
    });
});
