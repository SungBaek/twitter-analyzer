
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var Twitter = require('twitter');
var Scorer = require('./score.js');
var async = require('async');
var app = express();

// all environments
require('./env');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
//app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//twitter auhthorizations
var client = new Twitter( {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET_KEY,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

app.get('/', routes.index);
app.get('/users', user.list);


/* 
 * GET user handler with req.twitterHandle and return reputation score and latest tweets
 * 
 */
app.get('/tweet', function (req, res) {
    
    var twitterHandle = req.query.twitterHandle;
    

    client.get('statuses/user_timeline', { screen_name : twitterHandle , count : 100 }, function (error, tweets, response) {
        if (error || tweets.length == 0) {
            console.log(error);
            //render error page
            res.send("User Not Found");
        }
        else {
            var tweetList = [];
            var user = tweets[0].user;
            for (var i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                date.replace(/\+.*\s/,' ');
                tweetList.push({
                    text : tweets[i].text,
                    date : date,
                    count : tweets[i].retweet_count,
                    img : tweets[i].user.profile_image_url
                });
            }
            var cursor = -1;
            var score = Scorer.computeScore(tweets) * 10 + user.followers_count;
            //computing followers' score
            /*
            async.whilst(
                function () { return cursor != 0 },
                function (cb) {
                        client.get('followers/list', { screen_name: user.name, cursor: cursor, count: 200 }, function (error, data, response) {
                            if (error) {
                                console.log("could not get followerslist");
                                cursor = 0;
                                cb(null, cursor);
                            }
                            else {
                                console.log("hello");
                                for (var k = 0; k < data.length; k++) {
                                    score += data[k].followers_count;
                                }
                                cursor = data.next_cursor;
                                cb(null, cursor);
                            }
                        });
                    },
                function (err) {
                    user.score = score;
                    res.render('tweet', { tweets : tweetList, user : user }); 
                  }
            );*/
            
            user.score = score;
            res.render('tweet', { tweets : tweetList, user : user });
        }
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
