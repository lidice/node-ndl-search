# ndl-search
A Node library for searching books through the [National Diet Library's Search](http://iss.ndl.go.jp).

## Installation
```shell
$ npm install ndl-search
```

## Quick Examples
```js
var ndl = require('ndl-search');

// using OpenSearch
// search by ISBN(International Standard Book Number)
ndl.search({isbn: '1568493215'}, function(err, results) {
  console.log(results);
});
// search by creator and NDC(Nippon Decimal Classification)
ndl.search({creator: '夏目漱石', ndc: '9'}, function(err, results) {
  console.log(results);
});

// using SRU(Search/Retrieve Via URL) and CQL(Contextual Query Language)
ndl.searchByQuery('creator = 夏目漱石', {recordSchema: 'dcndl'}, function(err, results) {
  console.log(results);
});
```
About search conditions and options see [NDL Search API Specifications(Ver.1.8)2014.03.31(all)](http://iss.ndl.go.jp/information/wp-content/uploads/2014/04/ndlsearch_api_all_20140331_en.pdf).

## Documentation
### Methods
#### .search(conditions, callback)
Search by conditions for books.

Commonly-used condition keys
- `title`
- `creator`
- `publisher`
- `ibsn`: International Standard Book Number(10 or 13 digit)
- `ndc`: [Nippon Decimal Classification](https://en.wikipedia.org/wiki/Nippon_Decimal_Classification)(e.g. `7`: Art)
- `mediatype`

more information, see [NDL Search API Specifications(Ver.1.8)2014.03.31(all)](http://iss.ndl.go.jp/information/wp-content/uploads/2014/04/ndlsearch_api_all_20140331_en.pdf).

#### .searchByQuery(query, [options], callback)
SRU(Search/Retrieve Via URL) search by CQL(Contextual Query Language) for books.
This enables us to detailed search.

## License
MIT