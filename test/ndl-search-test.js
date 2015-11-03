'use strict';
var assert = require('assert');
var ndl = require('../lib/');

describe('ndl-search-test', function () {
  describe('#search', function () {
    it('should get the result when the search condition is valid', function (done) {
      ndl.search({isbn: '1568493215'}, function (err, result) {
        assert.ifError(err);
        assert.equal(1, result['openSearch:totalResults']);
        assert.equal('V.', result['item']['dc:title']);
        assert.equal('TohmasPynchon.', result['item']['dc:creator']);
        done();
      });
    });

    it('should get error when the search condition is invalid', function (done) {
      ndl.search({}, function (err, result) {
        assert.ok(err);
        done();
      });
    });
  });


  describe('#searchByQuery', function () {
    /*
    it('should get the results when the search query is valid', function (done) {
      ndl.searchByQuery('creator = 伊藤計劃', function (err, res) {
        if (err) throw err;
        assert(0 < res.numberOfRecords);
        done();
      });
    });
    */

    it('should get the results when the search query with options is valid', function (done) {
      this.timeout(30000);
      var options = { recordSchema: 'dc' };
      ndl.searchByQuery('creator = 伊藤計劃', options, function (err, res) {
        if (err) throw err;
        assert(0 < res.numberOfRecords);
        assert.equal(res.numberOfRecords, res.records.length);
        done();
      });
    });

    it('shoud get error when the search query invalid', function (done) {
      ndl.searchByQuery('', function(err, res) {
        assert.ok(err);
        done();
      });
    });
  });
});