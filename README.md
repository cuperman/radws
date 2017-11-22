# jeffws-service

Quickly build AWS REST services

## Document

```javascript
const Document = require('jeffws-service/document');
const uuid = require('uuid/v4');

const Article = Document({
  region: 'us-east-1',
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  tableName: 'Articles',
  partitionKey: 'ID',
  partitionKeyGenerator: uuid,
  timestamps: true
});

Article.create({
  title: 'My first article',
  text: 'This is a pretty cool library'
})
.then(article => alert(`Successfully created article ${article.ID}`));
```

### .all(filters)

### .find(identifier)

### .create(attributes)

### .update(identifier, attributes)

### .destroy(identifier)

## Resource

```javascript
const Resource = require('jeffws-service/resource');
const Article = require('./article');

// GET /articles/:id
exports.show = Resource.handler((request, render) => {
  return Article.find(request.params.id)
    .then(article => {
      render({ status: 200, body: { article }});
    });
});
```

### .handler(callback)
