const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
const { ItemNotFound } = require('./errors');

function documentClient(config) {
  return new AWS.DynamoDB.DocumentClient(config);
}

function jsonify(attributes) {
  return JSON.parse(JSON.stringify(attributes));
}

function newAttributes(attributes) {
  return Object.assign({}, attributes, {
    ID: uuid(),
    CreatedAt: new Date(),
    UpdatedAt: new Date()
  });
}

function updateAttributes(attributes) {
  return Object.assign({}, attributes, {
    UpdatedAt: new Date()
  });
}

function createItem(config, tableName, attributes = {}) {
  const item = jsonify(newAttributes(attributes));

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

function findItem(config, tableName, id) {
  return new Promise((resolve, reject) => {
    documentClient(config).get({
      TableName: tableName,
      Key: {
        ID: id
      }
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

function allItems(config, tableName) {
  return new Promise((resolve, reject) => {
    documentClient(config).scan({
      TableName: tableName,
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Items);
      }
    });
  });
}

function updateItem(config, tableName, id, attributes = {}) {
  const item = jsonify(updateAttributes(Object.assign({}, attributes, { ID: id })));

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

function destroyItem(config, tableName, id) {
  return new Promise((resolve, reject) => {
    documentClient(config).delete({
      TableName: tableName,
      Key: {
        ID: id
      }
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
  const all     = (config, tableName) => (() => allItems(config, tableName));
  const find    = (config, tableName) => ((id) => findItem(config, tableName, id));
  const create  = (config, tableName) => ((attributes) => createItem(config, tableName, attributes));
  const update  = (config, tableName) => ((id, attributes) => updateItem(config, tableName, id, attributes));
  const destroy = (config, tableName) => ((id) => destroyItem(config, tableName, id));

  const config  = {
    region: options.region,
    accessKeyId: options.accessKeyId,
    secretAccessKey: options.secretAccessKey
  };
  const { tableName } = options;

  return {
    all:    all(config, tableName),
    find:   find(config, tableName),
    create: create(config, tableName),
    update: update(config, tableName),
    destroy: destroy(config, tableName)
  };
};
