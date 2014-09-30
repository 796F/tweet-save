// please ignore any magic, magic can be resolved at xia.umd@gmail.com

var nodemailer = require('nodemailer');
var Q = require('q');
var config = require('./config.js');
var knex = require('knex')({
  dialect: 'mysql',
  connection: config.mysql,
  debug: false
});


GetYesterdayMentions().then(function(mentions){
    
    var output = '<table>';
    for(var i in mentions) {
        output +=   '<tr>' +
                    '<td style="border: 1px solid black; padding: 5px;">' + mentions[i].framework + '</td>' +
                    '<td style="border: 1px solid black; padding: 5px;">'+ mentions[i].count + '</td>' +
                    '</tr>'
    }
    output += '</table>'

    var mailOptions = {
        from: 'Famo.us Tweet Bot <xia.umd@gmail.com>', // sender address
        to: 'marketing@famo.us', // list of receivers
        subject: 'Twitter Mentions ' + _yesterdayDate(),
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
    auth: config.gmailAuth
});

function GetYesterdayMentions() {
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

function _yesterdayDate(){
    var today = new Date();
    //javascript has date values 0 indexed lol.
    return (today.getMonth()+1) + "/" + (today.getDate()-2);
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
