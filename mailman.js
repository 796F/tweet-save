var nodemailer = require('nodemailer');
var Q = require('q');
var config = require('./config.js');
var knex = require('knex')({
  dialect: 'mysql',
  connection: config.mysql,
  debug: false
});


_getYesterdayMentions().then(function(mentions){
    var today = new Date();
    var output = '<table>';
    for(var i in mentions) {
        output += '<tr><td style="border: 1px solid black; padding: 5px;">' + mentions[i].framework;
        output += '</td>';
        output += '<td style="border: 1px solid black; padding: 5px;">'+ mentions[i].count + '</td>';
        output += '</tr>'
    }
    output += '</table>'

    var mailOptions = {
        from: 'Famo.us Tweet Bot <xia.umd@gmail.com>', // sender address
        to: 'xia.umd@gmail.com', // list of receivers
        subject: 'Twitter Mentions ' + (today.getMonth()+1) + "/" + (today.getDate()-2),
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
            process.exit(1);
        }
    });
});

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'xia.umd@gmail.com',
        pass: 'MICHAEL09plant32'
    }
});

function _getYesterdayMentions() {
    var today = new Date();
    var start = new Date(1900 + today.getYear(), today.getMonth(), today.getDate()-1, 1).getTime() * 0.001;
    var end = new Date(1900 + today.getYear(), today.getMonth(), today.getDate(), 1).getTime() * 0.001;
    return knex('tweets')
    .distinct('flag').select()
    .then(function(targets){
        var promises = [];
        for (var index in targets){
            debugger;
            promises.push(_countMentions(targets[index].flag, start, end));
        }
        return Q.all(promises);
    });
}

function _countMentions(framework, start, end) {
    debugger;
    return knex('tweets').count('*')
    .where('created_at', '>', start)
    .where('created_at', '<', end)
    .where('flag', '=', framework)
    .then(function(row){
        debugger;
        return {
            count: row[0]['count(*)'],
            framework: framework
        }
    });
}
