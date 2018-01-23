# Radws

> Rapid application development without servers

## Getting Started

To use radws, install the node module:

```bash
npm install --save radws@latest
```

Create a radws app using the generators in [generator-radws](https://github.com/cuperman/generator-radws)

## Dev Server

You can use the dev server to test your routes and handlers locally before deploying to AWS.

```bash
npm run radws-dev-server
```

Then, connect to [http://localhost:3000](http://localhost:3000)

And try the API explorer at [http://localhost:3000/api_explorer](http://localhost:3000/api_explorer)

## Document

```javascript
const Document = require('radws/document');
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
const Resource = require('radws/resource');
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
