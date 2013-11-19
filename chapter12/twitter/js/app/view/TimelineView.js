define(['jquery', 'handlebars', 'backbone', 'app/collection/Timeline'], function($, Handlebars, Backbone, Timeline) {

var com = com || {};
com.apress = com.apress || {};
com.apress.view = com.apress.view || {};

com.apress.view.TimelineView = Backbone.View.extend({

	el: '#timeline',

	template: Handlebars.compile($("#timeline-template").html()),
	
	timeline: null,


	events: {
		'click .profile': 'showDialog'
	},

	initialize:  function(options){
		var self = this; 

		//create a collection for this view to render 
		self.timeline = new Timeline();//new com.apress.collection.Timeline();
		//initial render 
		self.render();

		//force the fetch to fire a reset event
		self.timeline.fetch({reset:true	
			});
		
		self.listenTo(self.timeline, 'reset', self.render);

	},



	render: function(){
		var self = this; 
		if(self.timeline.models.length > 0){
			var output = self.template({tweet: self.timeline.toJSON()});
			
			self.$el.append(output);			
		}
		return self; 
	},


	showDialog: function(options){

		var self =this, 
			$target = $(options.currentTarget),
			username = $target.data('user'); 

		/** 
		 * Reuse the profile view
		 **/
		var profileView = new com.apress.view.ProfilePopupView({user: username});
		
    }

});


    // export stuff:
    return com.apress.view.TimelineView;
});
