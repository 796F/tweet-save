//web service which allows webapp to get aggregated data for graphing.  
var Data = require('./Data.js');
var restify = require('restify');
// var Aggregator = require('./Aggregator.js');
var API = require('./api.js');

var ip_addr = '127.0.0.1';
var port    =  '8080';
 
var server = restify.createServer({
    name : "gitscan"
});

server.use(restify.queryParser());  //parses the query string, ie /repo/three.js
server.use(restify.bodyParser());   //turns requests into js objects automagically
server.use(restify.CORS());         //configures 'Cross-origin resource sharing'
 
server.listen(port ,ip_addr, function(){
    console.log('%s ws now listening on %s ', server.name , server.url);
});

// server.get({ path : '/data/:repo_name' } , API.dataForRepo);
server.post({ path : '/tweetVolume'}, API.tweetVolume);

server.get({ path: '/.*'}, restify.serveStatic({
  directory: './public',
  default: 'index.html'
}));
