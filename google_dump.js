var config = require('./config.js');
var Q = require('q');
var knex = require('knex')({
  dialect: 'mysql',
  connection: config.mysql,
  debug: false
});

getAll().then(function())

function getAll() {
  for(var curr = 28; curr<29; curr++) {
      var start = new Date(2014, 8, curr, 1).getTime();
      var end = new Date(2014, 8, curr+1, 1).getTime();
      getAllForDay().then(function(data) {
        console.log(data);
      });
  }    
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
        return {
            count: row[0]['count(*)'],
            framework: framework
        }
    });
}
