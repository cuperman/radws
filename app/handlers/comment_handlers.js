const action = require('../../lib/controller/action');
const Comment = require('../models/comment');
const { HTTP_CREATED, HTTP_NO_CONTENT, HTTP_OK } = require('../../lib/http/status_codes');

// GET /articles/:article_id/comments
exports.index = action.lambdaHandler((request, render) => {
  return Comment.all({ ArticleID: request.params.article_id })
    .then(data => {
      render({ status: HTTP_OK, body: data });
    });
});

// GET /articles/:article_id/comments/:id
exports.show = action.lambdaHandler((request, render) => {
  return Comment.find({ ID: request.params.id, ArticleID: request.params.article_id })
    .then(data => {
      render({ status: HTTP_OK, body: { comment: data } });
    });
});

// POST /articles/:article_id/comments
exports.create = action.lambdaHandler((request, render) => {
  const attributes = Object.assign({}, request.body.comment, { ArticleID: request.params.article_id });

  return Comment.create(attributes)
    .then(data => {
      render({ status: HTTP_CREATED, body: { comment: data } });
    });
});

// PATCH/PUT /articles/:article_id/comments/:id
exports.update = action.lambdaHandler((request, render) => {
  return Comment.update({ ID: request.params.id, ArticleID: request.params.article_id }, request.body.comment)
    .then(data => {
      render({ status: HTTP_OK, body: { comment: data } });
    });
});

// DELETE /articles/:article_id/comments/:id
exports.destroy = action.lambdaHandler((request, render) => {
  return Comment.destroy({ ID: request.params.id, ArticleID: request.params.article_id })
    .then(() => {
      render({ status: HTTP_NO_CONTENT });
    });
});
