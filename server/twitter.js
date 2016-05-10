var Twit = Meteor.npmRequire("twit");
var conf = JSON.parse(Assets.getText("twitter.json"));
var T = new Twit({
    consumer_key: conf.consumer.key,
    consumer_secret: conf.consumer.secret,
    access_token: conf.access_token.key,
    access_token_secret: conf.access_token.secret
});

var stream;

Meteor.methods({
    newSearch: function (term, keywordTerm) {

        // filter the twitter public stream by the keyword
        //var stream = T.stream("statuses/filter", { track: conf.keyword });
        stream = T.stream("statuses/filter", {track: term});

        // clear collection
        //Tweets.remove({});

        console.log(">>>>>> new terms: " + term + " <<<<<<<<<<<<<<<<");
        console.log(">>>>>> new keyword: " + keywordTerm + " <<<<<<<<<<<<<<<<");
        stream.on("tweet", Meteor.bindEnvironment(function (tweet) {
            var userName = tweet.user.name;
            var userScreenName = tweet.user.screen_name;
            var userTweet = tweet.text;
            var tweetDate = moment(new Date(tweet.created_at)).format("YYYY/MM/DD HH:MM:SS");
            var profileImg = tweet.user.profile_image_url;
            var timezone = tweet.user.time_zone;
            var language = tweet.lang;
            var tweet_id = tweet.id;
            
            //temp vars for geo coords since Twitter doesn't do them
            var latValue = 39.10;  
            var lngValue = -94.57; 
            var latRan = Math.round((Math.random() * (48-30)+30),-2);
            var lonRan = Math.round(((Math.random() * (114-79)+79))*-1,-2);

            console.log(userScreenName + " (" + userName + ")" + " said " + userTweet + " at " + tweetDate);
            console.log("=======================================");
            console.log("long/lat: " + lonRan + ":" + latRan);

            if (userName.length > 0) {
                
                //real-time wire search for keyword
                var foundKeyword = 0;
                if (userTweet.indexOf(keywordTerm) !=-1) {
                    foundKeyword = 1;
                    console.log(">>>>>> KEYWORD FOUND <<<<<<<<<<<<");
                };
                
                //place tweets into mongdb
                Tweets.insert({
                    user: userName,
                    userscreen: userScreenName,
                    tweet: userTweet,
                    picture: profileImg,
                    date: tweetDate,
                    date_inserted: new Date(),
                    search_term: term,
                    lang: language,
                    timezone: timezone,
                    entities: tweet.entities,
                    keyword_found: foundKeyword,
                    keyword: keywordTerm,
                    search_term: term,
                    lat: latRan,
                    lng: lonRan,
                    tweet_id: tweet_id
                    
                }, function (error) {
                    if (error)
                        console.log(error);
                });
                
                //place random geolcoations into mongdb
                Markers.insert({
                    lat: latRan,
                    lng: lonRan,
                    date_inserted: new Date(),
                    tweet_id: tweet_id,
                    keyword_found: foundKeyword
                    
                }, function (error) {
                    if (error)
                        console.log(error);
                });
            }
        }));
    },

    //server side function to pause/stop twitter stream
    streamStop: function() {
        stream.stop();
        console.log("!!!!!!! Stream Stopped !!!!!!!!!");
    },

     //server side function to remove twitter records from MongoDB
    clearCollection: function() {
        Tweets.remove({});
        TweetChartStats.remove({});
        KeywordChartStats.remove({});
        Markers.remove({});
        console.log("!!!!!!! Collection Cleared from Mongo !!!!!!!!!");
    }
});