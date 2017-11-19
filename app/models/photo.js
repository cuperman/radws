class Photo {
  static all() {
    return new Promise((resolve) => {
      resolve({
        Items: [
          { name: 'foo.jpg' },
          { name: 'bar.jpg' }
        ]
      });
    });
  }

  static find(id) {
    return new Promise((resolve) => {
      resolve({
        Item: { id: id, name: 'bar.jpg' }
      });
    });
  }

  static create(attributes = {}) {
    return new Promise((resolve) => {
      resolve({
        Item: Object.assign({}, attributes, { id: 1234, createdAt: new Date(), updateAt: new Date() })
      });
    });
  }

  static update(id, attributes = {}) {
    return new Promise((resolve) => {
      resolve({
        Item: Object.assign({}, attributes, { id, updatedAt: new Date() })
      });
    });
  }

  static destroy(id) {
    return new Promise((resolve) => {
      resolve();
    });
  }
}

module.exports = Photo;
