'use strict';

var _ = require('lodash');
var test = require('tape');

var clusto = require('../index');
var pluralize = require('../utils').pluralize;

var CLUSTO_TYPES = clusto.CLUSTO_TYPES;
var CLUSTO_TYPE_PLURALS = clusto.CLUSTO_TYPE_PLURALS;
var ClustoClient = clusto.ClustoClient;


test('ClustoClient is a function', function t(assert) {
    assert.equal(typeof ClustoClient, 'function');
    assert.end();
});

test('ClustoClient includes an instance method of `getByName`', function t(assert) {
    assert.equal(typeof ClustoClient.prototype.getByName, 'function');
    assert.end();
});

test('ClustoClient includes a list of instance methods named from Clusto types', function t(assert) {
    CLUSTO_TYPES.forEach(function eachClustoType(typeName) {
        assert.equal(typeof ClustoClient.prototype[typeName], 'function');
    });
    assert.end();
});

test('ClustoClient includes the plural names of the Clusto types as instance methods', function t(assert) {
    CLUSTO_TYPES.map(_.partial(pluralize, _, CLUSTO_TYPE_PLURALS)).forEach(function eachClustoTypeNamePlural(typeNamePlural) {
        assert.equal(typeof ClustoClient.prototype[typeNamePlural], 'function');
    });
    assert.end();
});
