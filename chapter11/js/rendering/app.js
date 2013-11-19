$(function() {

 Tweet = Backbone.Model.extend({

 	timestamp: null, 
 	initialize: function(){
 		timestamp = new Date();
 	},

 	getTimestamp: function(){
 		var friendly = moment(timestamp).fromNow();
 		return friendly;
 	}

	}); 

var tweet = new Tweet({text: 'James'});


var tweetView = new com.apress.view.TweetView({tweet: tweet});

console.log(tweet.getTimestamp());


});