const AWS = require('aws-sdk');
const { ItemNotFound } = require('./errors');

function awsConfig(options) {
  const {
    region,
    accessKeyId,
    secretAccessKey
  } = options;

  return {
    region,
    accessKeyId,
    secretAccessKey
  };
}

function documentClient(awsConfig) {
  return new AWS.DynamoDB.DocumentClient(awsConfig);
}

function jsonify(attributes) {
  return JSON.parse(JSON.stringify(attributes));
}

function createTimestamps() {
  return {
    CreatedAt: new Date(),
    UpdateAt: new Date()
  };
}

function updateTimestamps() {
  return {
    UpdatedAt: new Date()
  };
}

function generatePartitionKey(partitionKey, generator) {
  return {
    [partitionKey]: generator()
  };
}

function generateSortKey(sortKey, generator) {
  return {
    [sortKey]: generator()
  };
}

function newAttributes(options, attributes) {
  const {
    partitionKey,
    partitionKeyGenerator,
    sortKey,
    sortKeyGenerator,
    timestamps
  } = options;

  return Object.assign(
    {},
    attributes,
    (partitionKeyGenerator ? generatePartitionKey(partitionKey, partitionKeyGenerator) : {}),
    (sortKeyGenerator ? generateSortKey(sortKey, sortKeyGenerator) : {}),
    (timestamps ? createTimestamps() : {})
  );
}

function updateAttributes(options, attributes) {
  const { timestamps } = options;

  return Object.assign(
    {},
    attributes,
    (timestamps ? updateTimestamps() : {})
  );
}

function normalizeKey(options, key) {
  const { partitionKey } = options;

  if (typeof key === 'object') {
    return key;
  } else {
    return { [partitionKey]: key };
  }
}

function scanFilters(filters = {}) {
  let FilterExpressions = [];
  let ExpressionAttributeValues = {};

  Object.keys(filters)
    .forEach(key => {
      FilterExpressions.push(`${key} = :${key}`);
      ExpressionAttributeValues[`:${key}`] = filters[key];
    });

  const FilterExpression = FilterExpressions.join(' AND ');

  return {
    FilterExpression,
    ExpressionAttributeValues
  };
}

function createItem(options, attributes = {}) {
  const config = awsConfig(options);
  const { tableName } = options;
  const item = jsonify(newAttributes(options, attributes));

  return new Promise((resolve, reject) => {
    documentClient(config).put({
      TableName: tableName,
      Item: item
    }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(item);
      }
    });
  });
}

function findItem(options, key) {
  const config = awsConfig(options);
  const { tableName } = options;
  const normalKey = normalizeKey(options, key);

  return new Promise((resolve, reject) => {
    documentClient(config).get({
      TableName: tableName,
      Key: normalKey
    }, (err, data) => {
      if (err) {
        reject(err);
      } else if (!data.Item) {
        reject(new ItemNotFound());
      } else {
        resolve(data.Item);
      }
    });
  });
}

function allItems(options, filters) {
  const config = awsConfig(options);
  const { tableName } = options;

  let params;
  if (!filters) {
    params = { TableName: tableName };
  } else {
    const {
      FilterExpression,
      ExpressionAttributeValues
    } = scanFilters(filters);
    params = {
      TableName: tableName,
      FilterExpression,
      ExpressionAttributeValues
    };
  }

  return new Promise((resolve, reject) => {
    documentClient(config).scan(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Items);
      }
    });
  });
}

function updateItem(options, key, attributes = {}) {
  const config = awsConfig(options);
  const { tableName } = options;
  const normalKey = normalizeKey(options, key);
  const item = jsonify(updateAttributes(options, Object.assign({}, attributes, normalKey)));

  return new Promise((resolve, reject) => {
    documentClient(config).put({
      TableName: tableName,
      Item: item
    }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(item);
      }
    });
  });
}

function destroyItem(options, key) {
  const config = awsConfig(options);
  const { tableName } = options;
  const normalKey = normalizeKey(options, key);

  return new Promise((resolve, reject) => {
    documentClient(config).delete({
      TableName: tableName,
      Key: normalKey
    }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = (options = {}) => {
  const all     = (options) => ((filters) => allItems(options, filters));
  const find    = (options) => ((key) => findItem(options, key));
  const create  = (options) => ((attributes) => createItem(options, attributes));
  const update  = (options) => ((key, attributes) => updateItem(options, key, attributes));
  const destroy = (options) => ((key) => destroyItem(options, key));

  return {
    all:    all(options),
    find:   find(options),
    create: create(options),
    update: update(options),
    destroy: destroy(options)
  };
};
