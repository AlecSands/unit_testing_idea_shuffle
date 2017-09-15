const chai = require('chai');
const should = chai.should();
const topic = require('../../../server/routes/topic.router.js');

describe('Capitalize First Letter', function () {
  context('String Tests', function() {
    it('should return a string with capitalized first letter', function() {
      const string = 'test this string.';

      topic.capitalizeFirstLetter(string)
        .should.equal('Test this string.');
    });
  });
});
