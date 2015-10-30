process.env.NODE_ENV = 'test';

var Browser = require('zombie');

Browser.localhost('127.0.0.1', 5000);

describe('User visits homepage', function() {
  var browser = new Browser();

  before(function(done) {
    browser.visit('/', done);
  });

  it('Should respond with success', function() {
    browser.assert.success();
  });

  it('Should have a start button', function() {
    browser.assert.element('#start');
  });

  it('Should have a start button disabled', function() {
    browser.assert.hasClass('#start', 'disabled');
  });
});
