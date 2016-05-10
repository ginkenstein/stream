//publish meteor soruces

Meteor.publish("tweets", function() {
    return Tweets.find();
});

Meteor.publish("tweetstats", function() {
    return TweetChartStats.find();
});

Meteor.publish("keywordstats", function() {
    return KeywordChartStats.find();
});

Meteor.publish("markers", function() {
    return Markers.find();
});