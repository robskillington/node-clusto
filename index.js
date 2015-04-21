'use strict';

var _ = require('lodash');
var Prober = require('airlock');
var request = require('request');

module.exports.ClustoClient = ClustoClient;

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
            json: json
        };
        request(options, requestCallback);
    }
};
