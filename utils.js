'use strict';

var _ = require('lodash');

module.exports.pluralize = function pluralize(word, dictionary) {
    return _.get(dictionary, word, word + 's');
};
