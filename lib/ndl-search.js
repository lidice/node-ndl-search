'use strict';

var request = require('request');
var parseString = require('xml2js').parseString;
var async = require('async');
var queryString = require('query-string');
var objectAssign = require('object-assign');
var util = require('util');

var sruURL = 'http://iss.ndl.go.jp/api/sru';
var openSearchURL = 'http://iss.ndl.go.jp/api/opensearch';

/**
 * SRU(Search/Retrieve Via URL) interface.
 * @param {object} option - The Search Option.(see also, http://iss.ndl.go.jp/information/wp-content/uploads/2014/04/ndlsearch_api_all_20140331_en.pdf)
 * @constructor
 */
var SRU = function(option) {
  option = objectAssign({operation: 'searchRetrieve'}, option);
  this.url = sruURL + '?' + queryString.stringify(option) + '&query=';
};

/**
 * Acquire the search results by SRU(Search/Retrieve via URL).
 * @param {string} query - CQL(Contextual Query Language http://www.loc.gov/standards/sru/cql/)
 * @param {function} callback
 */
SRU.prototype.searchByQuery = function (query, callback) {
  if (typeof query === 'undefined' || query.length === 0) {
    return callback(new Error('undefined is not valid query.'));
  }

  request(this.url + encodeURIComponent(query), function (err, response, body) {
    if (err) return callback(err);
    if (response.statusCode === 200) {
      var parseOption = { explicitArray: false };
      parseString(body, parseOption, function (err, doc) {
        if (err || !doc['searchRetrieveResponse']) return callback(err);
        var results = doc.searchRetrieveResponse;

        var records = [];
        async.forEachOfSeries(results.records.record, function (val, key, cb) {
          parseString(val.recordData, parseOption, function (err, data) {
            if (err) return cb(err);
            try {
              records.push(data);
            } catch (e) {
              return cb(e);
            }
            cb();
          });
        }, function (err) {
          if (err) return callback(err);
          results.records = records;
          callback(null, results);
        });
      });
    }
  });
};

/**
 * OpenSearch interface.
 * @constructor
 */
var OpenSearch = function() {
  this.url = openSearchURL;
};

/**
 * Acquire the search results in RSS 2.0 format.
 * @param {object} condition - The Search Condition.(see also, http://iss.ndl.go.jp/information/wp-content/uploads/2014/04/ndlsearch_api_all_20140331_en.pdf)
 * @param {function} callback
 */
OpenSearch.prototype.search = function(condition, callback) {
  if (typeof condition === 'undefined' || Object.keys(condition).length === 0) {
    return callback(new Error('undefined is not valid search condition.'));
  }

  var requestURL = this.url + '?' + queryString.stringify(condition);

  request(requestURL, function(err, response, body) {
    if (err) return callback(err);
    if (response.statusCode === 200) {
      var parseOption = { explicitArray: false };
      parseString(body, parseOption, function(err, doc) {
        if (err) return callback(err);
        callback(null, doc.rss.channel);
      });
    }
  });
};

module.exports = {
  search: function(condition, callback) {
    return (new OpenSearch()).search(condition, callback);
  },
  searchByQuery: function(query, option, callback) {
    if (util.isFunction(option)) {
      callback = option;
      option = {};
    }
    return (new SRU(option)).searchByQuery(query, callback);
  }
};