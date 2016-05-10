if (Meteor.isClient) {
    Template.analytics.helpers({

        tweetscount: function() {
            return Tweets.find().count();
        },

        langcount: function() {
            return Tweets.find({lang: "en"}).count();
        },

        keywordcount: function() {
            return Tweets.find({keyword_found: 1}).count();
        },

        timezones: function () {
            return tzStats();
        }
    });
}
