if (Meteor.isClient) {

    Template.tweetDrill.helpers({

        keywordTweeter: function () {
            return Tweets.find({keyword_found: 1}, {sort: {date_inserted: -1}, limit: 10});
        },
    });
}
