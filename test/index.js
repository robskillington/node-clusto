'use strict';

var CLUSTO_TYPES = require('../index').CLUSTO_TYPES;
var ClustoClient = require('../index').ClustoClient;
var test = require('tape');

test('ClustoClient is a function', function t(assert) {
    assert.equal(typeof ClustoClient, 'function');
    assert.end();
});

test('ClustoClient includes a list of instance methods named from Clusto types', function t(assert) {
	CLUSTO_TYPES.forEach(function eachClustoType(typeName) {
		assert.equal(typeof ClustoClient.prototype[typeName], 'function');
	});
	assert.end();
});