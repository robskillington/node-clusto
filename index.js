'use strict';

var _ = require('lodash');
var Prober = require('airlock');
var request = require('request');

var CLUSTO_TYPES = [
    'appliance',
    'cage',
    'clustometa',
    'consoleserver',
    'datacenter',
    'generic',
    'location',
    'networkswitch',
    'pipeline',
    'pod',
    'pool',
    'powerstrip',
    'rack',
    'resourcemanager',
    'role',
    'server',
    'zone'
];
var CLUSTO_TYPE_PLURALS = {
    'networkswitch': 'networkswitches'
};

module.exports = {
    CLUSTO_TYPES: CLUSTO_TYPES,
    CLUSTO_TYPE_PLURALS: CLUSTO_TYPE_PLURALS,
    ClustoClient: ClustoClient
};

function ClustoClient(options) {
    options = options || {};
    this._baseURL = options.baseURL || 'http://localhost:9996';
    if (this._baseURL.slice(-1) === '/') {
        this._baseURL = this._baseURL.slice(0, -1);
    }
    if (options.username && options.password) {
        var auth = options.username + ':' + options.password;
        this._auth = new Buffer(auth).toString('base64');
    } else {
        this._auth = null;
    }
    this._logger = options.logger || null;
    this._statsd = options.statsd || null;
    this._request = options.request || request;
    this._prober = options.prober || new Prober(_.extend({
        title: 'node-clusto',
        logger: this._logger,
        statsd: this._statsd
    }, options.airlock || {}));
    this._timeout = options.timeout || 15000;
}

ClustoClient.prototype.getByName = function getByName(name, callback) {
    var self = this;
    var uri = '/query/get_by_name?name=' + encodeURIComponent(name);
    self._tryRequest(callback, uri);
};

ClustoClient.prototype._tryRequest = function tryRequest(callback, uri, method, json) {
    var self = this;
    uri = self._baseURL + uri;
    method = method || undefined;
    json = json || true;

    var headers = {};
    if (this._auth) {
        headers.Authorization = 'Basic: ' + this._auth;
    }

    self._prober.probe(boundRequest, function onBypass(err) {
        callback(err);
    }, function onResponse(err, resp, json) {
        if (err || !resp) {
            return callback(err || new Error('No response was returned'));
        }
        if (resp.statusCode !== 200) {
            err = new Error('Non 200 response');
            err.statusCode = resp.statusCode;
            return callback(err);
        }
        callback(null, json);
    });

    function boundRequest(requestCallback) {
        var options = {
            uri: uri,
            method: method,
            headers: headers,
            json: json,
            timeout: self._timeout
        };
        self._request(options, requestCallback);
    }
};

ClustoClient.defineClustoType = function definClustoType(typeName, typeNamePlural) {
    var typeNamespace = '/' + typeName + '/';

    if (!typeNamePlural) {
        typeNamePlural = typeName + 's';
    }

    this.prototype[typeName] = function getEntity(name, callback) {
        var uri = typeNamespace + encodeURIComponent(name) + '/';
        this._tryRequest(callback, uri);
    };

    this.prototype[typeNamePlural] = function getEntities(callback) {
        this._tryRequest(callback, typeNamespace);
    };

    return this;
}.bind(ClustoClient);

CLUSTO_TYPES.forEach(function eachClustoType(typeName) {
    var typeNamePlural = _.get(CLUSTO_TYPE_PLURALS, typeName, typeName + 's');

    ClustoClient.defineClustoType(typeName, typeNamePlural);
});