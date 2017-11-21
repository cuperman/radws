const Document = require('../../lib/db/document');
const config   = require('../../config/database');
const uuid = require('uuid/v4');

const Article = Document(Object.assign({}, config, {
  tableName: 'CRUD.Articles',
  partitionKey: 'ID',
  partitionKeyGenerator: uuid,
  timestamps: true
}));

module.exports = Article;
