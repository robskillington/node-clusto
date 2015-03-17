'use strict';

var ClustoClient = require('../index').ClustoClient;
var test = require('tape');

test('ClustoClient is a function', function t(assert) {
    assert.equal(typeof ClustoClient, 'function');
    assert.end();
});
