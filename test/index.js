'use strict';

var _ = require('lodash');
var test = require('tape');

var ModNodeClusto = require('../index');

var CLUSTO_TYPES = ModNodeClusto.CLUSTO_TYPES;
var CLUSTO_TYPE_PLURALS = ModNodeClusto.CLUSTO_TYPE_PLURALS;
var ClustoClient = ModNodeClusto.ClustoClient;


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

test('ClustoClient includes the plural names of the Clusto types as instance methods', function t(assert) {
	CLUSTO_TYPES.map(function mapClustoTypeNamePlural(typeName) {
		return _.get(CLUSTO_TYPE_PLURALS, typeName, typeName + 's');
	}).forEach(function eachClustoTypeNamePlural(typeNamePlural) {
		assert.equal(typeof ClustoClient.prototype[typeNamePlural], 'function');
	});
	assert.end();
});
