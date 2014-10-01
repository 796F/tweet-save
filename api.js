var Data = require('./Data.js');
var Aggregator = require('./Aggregator.js');

API = {}

API.test = function (req, res , next){
  res.setHeader('Access-Control-Allow-Origin','*');
  var streams_wanted = ['repository_watchers', 'repository_open_issues', 'repository_forks'];
  Data.getDataByParams([req.params.repository_name], [req.params.owner], streams_wanted)
  .then(function(data){
    res.send(200, data);
    return next();
  });
}

API.tweetVolume = function (req, res , next){
  var period = req.params.period
  Data.getAllTweets()
  .then(function(tweets){ 
    var plottable_data = Aggregator.tweetFrequency(tweets, 1);
    res.send(200, plottable_data);
    return next();
  });
}

module.exports = API;
