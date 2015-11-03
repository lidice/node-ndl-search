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