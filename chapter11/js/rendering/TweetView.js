var com = com || {};
com.apress = com.apress || {};
com.apress.view = com.apress.view || {};


com.apress.view.TweetView = Backbone.View.extend({

	el: '#tweet',
	$timestamp: null, 
	$content : null, 
	tweetTemplate: Handlebars.compile($("#tweet-template").html()),
	timestampTemplate: Handlebars.compile($("#timestamp-template").html()),
	tweet : null,
	events: {
		'click': 'markSelected'
	},


	markSelected: function(options){
		console.log('marking..');
		var self = this,
			$target = $(options.currentTarget);
		$target.addClass('selected');

	},


	initialize: function(options){
		this.tweet = options.tweet;
		this.render();
	},

	render: function(){
		this.renderContent(). 
			renderTimestamp();
		return this; 	
	},

	renderContent: function(){
		//if the content is already rendered remove
		if(this.$content){
			this.$content.remove();
		}
		//deal with the main content template 
		$content = this.tweetTemplate({
				tweet: this.tweet.toJSON()
			});
		this.$el.append($content);
		return this;
	}, 

	renderTimestamp: function(){
		//if the timestamp is already rendered remove
		if(this.$timestamp){
			this.$timestamp.remove();
		}
		//deal with the timestamp template 
		$timestamp = this.timestampTemplate({
				time: this.tweet.getTimestamp()
			});
		this.$('#timesta').append($timestamp);
		
		return this;
	}

});