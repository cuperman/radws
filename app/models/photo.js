const Document = require('../../lib/db/document');
const config   = require('../../config/database');

const Photo = Document(Object.assign({}, config, {
  tableName: 'CRUD.Photos'
}));

module.exports = Photo;
