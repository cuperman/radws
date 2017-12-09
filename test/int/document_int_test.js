const { expect } = require('chai');
const Document = require('../../document');
const { ItemNotFound } = require('../../document/errors');
const config = require('../config/database');

describe('Document Integration', () => {
  const doc = Document({
    region: config.StackRegion,
    tableName: config.DocumentTableName,
    partitionKey: 'ID'
  });

  describe('::create', () => {
    it('creates an item', done => {
      doc.create({ ID: 1, Name: 'Jeans', Color: 'Blue' })
        .then(item => {
          expect(item).to.include({ ID: 1, Name: 'Jeans', Color: 'Blue' });
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('::find', () => {
    it('reads an item', done => {
      doc.find(1)
        .then(item => {
          expect(item).to.include({ ID: 1, Name: 'Jeans', Color: 'Blue' });
          done();
        })
        .catch(err => done(err));
    });

    it('throws ItemNotFound if item does not exist', done => {
      doc.find(2)
        .then(() => done(new Error('Unexpected success')))
        .catch(err => {
          expect(err).to.be.an.instanceof(ItemNotFound);
          done();
        });
    });
  });

  describe('::udpate', () => {
    it('updates an attribute of an item', done => {
      doc.update(1, { Color: 'Black' })
        .then(item => {
          expect(item).to.include({ ID: 1, Name: 'Jeans', Color: 'Black' });
          done();
        })
        .catch(err => done(err));
    });

    it('updates an attribute to an empty string', done => {
      doc.update(1, { Color: '' })
        .then(item => {
          expect(item).to.include({ ID: 1, Name: 'Jeans', Color: null });
          done();
        })
        .catch(err => done(err));
    });

    it('throws ItemNotFound if item does not exist', done => {
      doc.update(2, { Color: 'Black' })
        .then(() => done(new Error('Unexpected success')))
        .catch(err => {
          expect(err).to.be.an.instanceof(ItemNotFound);
          done();
        });
    });
  });

  describe('::destroy', () => {
    it('deletes an item', (done) => {
      doc.destroy(1)
        .then(() => done())
        .catch(err => done(err));
    });

    it('throws ItemNotFound if item does not exist', done => {
      doc.destroy(2)
        .then(() => done(new Error('Unexpected success')))
        .catch(err => {
          expect(err).to.be.an.instanceof(ItemNotFound);
          done();
        });
    });
  });
});
