//chart global vars
var dataPoints1 = [{x:0, y:0}]; // init dataPoints as empty sets
var dataPoints2 = [{x:0, y:0}];
var lastTimelineMark = 0;
var updateInterval = 3;     // 1 sec per 1000 milliseconds; increments count for keywords and twwets are rendered
var timeline = 0;           //what value it starts at
var chartWindow = 60;       //time window to view data on chart in seconds

//session vars for tracking counts and rendering status for chart
Session.set("last_tweet_count", 0);
Session.set("last_keyword_count", 0);
Session.set("RenderingStarted", 0);
Session.set("chartHeight", "200px");
               
if (Meteor.isClient) {

    Template.canvaschart.onRendered (function() {
       
        //build chart
        console.log("Building Chart...");
        var chart = new CanvasJS.Chart("chartContainer",{
                title :{
                    text: "Live Twitter Stream"
                },
                toolTip: {
                  shared: true
                },
                axisX: {						
                    title: "Time Interval (sec)"
                },
                axisY: {						
                    title: "Tweet Vol"
                },
                zoomEnabled: true,
                exportEnabled: true,
                panEnabled: true,
                legend: {
                    fontSize: 15
                  },
                data: [{
                    type: "area",
                    color: "rgba(40,175,101,0.6)",
                    dataPoints : dataPoints1,
                    showInLegend: true,
                    name: "Tweets",
                    legendText: "Tweets",
                    click: function(e){alert(  "Seconds: " + e.dataPoint.x + ", Tweets Recorded: "+ e.dataPoint.y);}
                  },
                  {
                    type: "spline",
                    dataPoints : dataPoints2,
                    showInLegend: true,
                    name: "Keywords",
                    legendText: "Keywords",
                    click: function(e){alert(  "Seconds: " + e.dataPoint.x + ", Keywords Found: "+ e.dataPoint.y);}
                }]
        });
        console.log("count on init render:" + TweetChartStats.find().count());
        console.log("current route:" + Iron.Location.get().path);
        
        //figure out route and scale chart
        if (Iron.Location.get().path=="/tweets") {
            Session.set("chartHeight", "200px"); //small
        } else {
            Session.set("chartHeight","300px"); //tall
        };
       
        //init chart render
        chart.render();
        
        if (Session.get("RenderingStarted")==0) {           
            if (Session.get("streamState")==0 || Session.get("clearChart")==0) {
                
                //check to see if there is a datset in existence
                if (TweetChartStats.find().count()>0) {
                    
                    //calculate time delta to get keyword drilldown details
                    startRange = endRange;
                    endRange = startRange + updateInterval;
                    
                    //load datapoints from db collection, iterate through array and push              
                    resultDS = TweetChartStats.find({}, {x: 1, y: 1, _id:0});
                    resultKW = KeywordChartStats.find({}, {x: 1, y: 1, _id:0});
                    //resultKWDrill = Tweets.find({'date_inserted': {'$gte': startRange, '$lt': endRange}});  
                    
                    // loop over each sample dataset
                    resultDS.forEach( function (stat) {
                        //update and push data
                        dataPoints1.push({
                            x: stat.x,
                            y: stat.y
                            });
                        lastTimelineMark = stat.x;
                        console.log("db y val: " + lastTimelineMark);
                    });
                    
                    // loop over each sample dataset2
                    resultKW.forEach( function (stat) {
                        //update and push data
                        dataPoints2.push({
                            x: stat.x,
                            y: stat.y
                            });
                    }); 
        
                    //log for debugging
                    console.log("retrieved from database");
        
                };
            //update init chart render
            chart.render();                  

            }
            
            //set iniital time maker to pickup from
            Session.set("lastTimeline", lastTimelineMark);
                   
            //log for debugging
            console.log(">>>>>>>>>>>> INIT Render <<<<<<<<<<<<<<<");
            console.log("interval @: " + updateInterval);
            console.log("timeline @: " + timeline);
            console.log("last timeline @: " + Session.get("lastTimeline"));
            console.log("last tweet_count @: " + Session.get("last_tweet_count"));
            console.log("last keyword_count @: " + Session.get("last_keyword_count"));
            console.log("stream state:" + Session.get("streamState"));
            console.log("chart clear:" + Session.get("clearChart"));
            console.log("tweet db count: " + TweetChartStats.find().count());
            console.log("kw db count: " + KeywordChartStats.find().count());
        
            Session.set("RenderingStarted", 1);
        }
        
        // update chart after specified time.         
        var updateChart = function () {
          
            if (Session.get("clearChart")==1) {
                               
                //clear chart dataset & render
                dataPoints1 = [];
                dataPoints2 = [];
                chart.render();                
                
                //reset clear chart and reset var
                Session.set("clearChart", 0);
                Session.set("lastTimeline", 0);
                location.reload(); 
                
                //log to console
                console.log("%%%%%% Chart Cleared %%%%%%%%%%");
                console.log("chart clear state:" + Session.get("clearChart"));
            }
          
            if (Session.get("streamState")==1) {    
                
                //update x axis counter and sessionize last timeline marker
                Session.set("lastTimeline", timeline);
                timeline = Session.get("lastTimeline") + updateInterval;               

                //get current stream counts
                var current_tweet_count = Tweets.find({}, {sort: {date_inserted: -1}}).count();
                var current_keyword_count = Tweets.find({keyword_found:1}, {sort: {date_inserted: -1}}).count();
              
                //fetch the latest less the last count
                var tweet_count_rate =  current_tweet_count - Session.get("last_tweet_count");
                var keyword_count_rate =  current_keyword_count - Session.get("last_keyword_count");
                
                //insert into database for tracking stats
                TweetChartStats.insert({x: timeline, y: tweet_count_rate});
                KeywordChartStats.insert({x: timeline, y: keyword_count_rate});
              
                //update and push data
                dataPoints1.push({
                    x: timeline,
                    y: tweet_count_rate
                    });
                dataPoints2.push({
                    x: timeline,
                    y: keyword_count_rate
                    });
                
                //update last count var
                Session.set("last_tweet_count", current_tweet_count);
                Session.set("last_keyword_count", current_keyword_count);
                
                //check x axis to shift chart after 1 min recording time
                if (timeline > chartWindow)
                {
                    dataPoints1.shift();
                    dataPoints2.shift();
                    console.log("shifting window...");
                }
        
                // updating legend text with  updated with y Value 
    			chart.options.data[0].legendText = "Tweets " + current_tweet_count;
    			chart.options.data[1].legendText = "Keywords " + current_keyword_count;
                
                //re-render
                chart.render();
                
                //console debugging
                console.log("----------------- REPEAT Render ----------------");
                console.log("refreshing chart");
                console.log("chart window (seconds): " + chartWindow);
                console.log("new timeline @: " + timeline);
                console.log("last timeline @: " + Session.get("lastTimeline"));
                console.log("tweet_count r:" + tweet_count_rate);
                console.log("keyword_count r:" + keyword_count_rate);
                console.log("stream state r:" + Session.get("streamState"));
                console.log("tweet db count: " + TweetChartStats.find().count());
                console.log("kw db count: " + KeywordChartStats.find().count());
            }
        };       
        
        //update based on interval
        setInterval(function(){updateChart()}, updateInterval*1000);
               
    });
};