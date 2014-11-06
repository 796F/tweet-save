var config = require('./config.js');
var Q = require('q');
var knex = require('knex')({
  dialect: 'mysql',
  connection: config.mysql,
  debug: false
});

var map = {}

getAll().then(function(){
  for(var framework in map) {
    var array = map[framework];
    array.sort(function(a, b) {
      return a.start > b.start;
    });
    var output = framework + ", ";
    for(var i=0; i<array.length; i++) {
      output += array[i].count;
      output += array[i].start;
      output += ", ";
    }
    console.log(output);
  }


});

function getAll() {
  var promises = []
  for(var curr = 28; curr<66; curr++) {
      var start = new Date(2014, 8, curr, 1).getTime() * 0.001;
      var end = new Date(2014, 8, curr+1, 1).getTime() * 0.001;
      promises.push(getAllForDay(start, end))
  }    
  return Q.all(promises);
}

function getAllForDay(start, end) {
  return knex('tweets')
  .distinct('flag').select()
  .then(function(targets){
      var promises = [];
      for (var index in targets){
          promises.push(_countMentions(targets[index].flag, start, end));
      }
      return Q.all(promises);
  });
}

function _countMentions(framework, start, end) {
    return knex('tweets').count('*')
    .where('created_at', '>', start)
    .where('created_at', '<', end)
    .where('flag', '=', framework)
    .then(function(row){
      if(!map[framework]) map[framework] = [];
      map[framework].push({start: start, count: row[0]['count(*)'] });
        
      return {
          count: row[0]['count(*)'],
          framework: framework
      }
    });
}
