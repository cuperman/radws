const Document = require('../../lib/db/document');
const config   = require('../../config/database');
const uuid = require('uuid/v4');

const Comment = Document(Object.assign({}, config, {
  tableName: 'CRUD.Comments',
  partitionKey: 'ID',
  partitionKeyGenerator: uuid,
  sortKey: 'ArticleID',
  timestamps: true
}));

module.exports = Comment;
