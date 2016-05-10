//setup client subscriptions to meteor collection sources

if (Meteor.isClient) {
  Meteor.subscribe("tweets");
  Meteor.subscribe("tweetstats");
  Meteor.subscribe("keywordstats");
  Meteor.subscribe("markers"); 
}

//reset dataset
//Meteor.call("clearCollection");