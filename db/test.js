// var api = require('./api');

// (async() => {
//     var element={
//         name:'test',
//         dpid:1234354,
//         pic:'testurl'
//     }
//     let data = await api.creatMember(element);

//     console.log('over');
// });

var BloomFilter = require('bloomfilter').BloomFilter ;

var bloom = new BloomFilter(
    32 * 256, // number of bits to allocate.
    16 // number of hash functions.
);
// Add some elements to the filter.
bloom.add("foo");
bloom.add("bar");
var array = [].slice.call(bloom.buckets);

console.log(JSON.stringify(array));