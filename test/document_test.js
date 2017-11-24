const { expect } = require('chai');
const Document = require('../document');

describe('Document', () => {
  const doc = Document();

  it('responds to all', () => expect(doc).to.respondTo('all'));
  it('responds to find', () => expect(doc).to.respondTo('find'));
  it('responds to create', () => expect(doc).to.respondTo('create'));
  it('responds to update', () => expect(doc).to.respondTo('update'));
  it('responds to destroy', () => expect(doc).to.respondTo('destroy'));
});
