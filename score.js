var fs = require('fs');
var readline = require('readline');
var async = require('async');


var positiveMap = {};
var negativeMap = {};

console.log("ello score");
var positiveFR = readline.createInterface({ input : fs.createReadStream('./positives.txt') });
var negativeFR = readline.createInterface({ input : fs.createReadStream('./negatives.txt') });

positiveFR.on('line', function (line) {
    positiveMap[line] = { word : line };    
});

negativeFR.on('line', function (line) {
    negativeMap[line] = { word : line };
});

var checkPositive = function (word) {
    if (word in positiveMap)
        return true;
    else
        return false;
};

var checkNegative = function (word) {
    if (word in negativeMap)
        return true;
    else
        return false;
}

/*
 * Compute score using tweets and user data 
 * +1 for positive word, -1 for negative word, + 2*(number of followers of follower) for each follower
 */

function computeScore(tweets) {
    var score = 0;
    for (var i = 0; i < tweets.length; i++) {
        var words = tweets[i].text.split(" ");
        for (var j = 0; j < words.length; j++) {
            if (checkPositive(words[j]))
                score += 1;
            if (checkNegative(words[j]))
                score -= 1;
        }
    }
    return score;
};


//exports
module.exports.computeScore = computeScore;

