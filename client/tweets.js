if (Meteor.isClient) {

    //set session vars on client
    Session.set("toggleChart", false);
    Session.set("toggleMap", false);
    Session.set("toggleStream", true);
    Session.set("streamButtonState", true);
    Session.set("resetButtonState", "disabled");
    Session.set("streamButton", "Pause Stream");
    Session.set("resetButton", "Clear Data");
    Session.set("streamState", 0);

    Template.tweets.helpers({

        tweets: function () {
            return Tweets.find({}, {sort: {date_inserted: -1}, limit: 10});
        },
        showStream: function () {
            return Session.get("toggleStream");
        },
        showChart: function () {
            return Session.get("toggleChart");
        },
        showMap: function () {
            return Session.get("toggleMap");
        },
        searchTerm: function () {
            return Session.get("searchTerm");
        },
        streamButtonState: function () {
            return Session.get("streamButtonState");
        },
        streamButton: function () {
            return Session.get("streamButton");
        },
        resetButtonState: function () {
            return Session.get("resetButtonState");
        },
        keywordTerm: function () {
            return Session.get("keywordTerm");
        },
    });
    
    Template.tweets.events({

        "submit .new-term": function (event) {
            // Prevent default browser form submit
            event.preventDefault();

            // Get value from form element
            var term = event.target.textinput.value;
            var keyterm = event.target.keywordinput.value;

            //set session inidicating a new stream is starting
            Session.set("streamState", 1);
            Session.set("searchTerm", term);
            Session.set("keywordTerm", keyterm);
            Session.set("clearChart",0);
            
            //activate stop streaming button
            Session.set("streamButtonState", false);
            Session.set("streamButton", "Pause Stream");
            Session.set("resetButton", "Clear Data");
            
            //activate reset data button
            Session.set("resetButtonState", "disabled"); //deactivate reset data button
            
            //get new stream and render
            Meteor.call("newSearch", term, keyterm);
            
        },

        "change .toggle-chart": function () {
            Meteor.call("toggleChart", this.value);
        },

        "change .toggle-map": function () {
            Meteor.call("toggleMap", this.value);
        },

        "change .toggle-stream": function (event) {
            Meteor.call("toggleStream", event.target.showStream.value);
        },
        
        "click .stop-stream": function (event) {
            
            if (Session.get("streamState")==0) {
                //resume stream and render
                Meteor.call("newSearch", Session.get("searchTerm"), Session.get("keywordTerm"));
                Session.set("streamState", 1);  //indicates stream is now active
                Session.set("streamButton", "Pause Stream");     //indicates you can stop stream once started
                Session.set("resetButtonState", "disabled"); //deactivate reset data button
            } else {
                //stop stream
                Meteor.call("streamStop");
                Session.set("streamState", 0);  //indicates stream is now stopped
                Session.set("streamButton", "Resume Stream");     //indicates you can resume stream once stopped
                Session.set("resetButtonState", ""); //activate reset data button
            }
        },

        "click .clear-stream": function (event) {
                       
            //reset vars
            Session.set("searchTerm", "");
            Session.set("keywordTerm", "");
            Meteor.call("clearCollection");
            
            //reset buttons
            Session.set("streamButtonState", 0);
            Session.set("resetButtonState", ""); //deactivate reset data button
            Session.set("resetButton", "Clearing...");     
            
            //set clear chart var
            Session.set("clearChart",1);
        },

        "click .toggle-stream": function () {
            var newState = ! Session.get("toggleStream");
            Session.set("toggleStream", newState);
        },

        "click .toggle-chart": function () {
            var newState = ! Session.get("toggleChart");
            Session.set("toggleChart", newState);
        },
        
        "click .toggle-map": function () {
            var newState = ! Session.get("toggleMap");
            Session.set("toggleMap", newState);
        }
    });
}
