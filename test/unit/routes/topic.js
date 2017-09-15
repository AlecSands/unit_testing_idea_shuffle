const chai = require('chai');
const should = chai.should();
const topic = require('../../../server/routes/topic.router.js');
const Topic = require('../../../server/models/topic.js');

describe('Topic tests', function () {
  context('String tests', function() {
    it('should return a string with capitalized first letter', function() {
      const string = 'test this string.';

      topic.capitalizeFirstLetter(string)
        .should.equal('Test this string.');
    });
  });
});
