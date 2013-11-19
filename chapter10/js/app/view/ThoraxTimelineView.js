var com = com || {};
com.apress = com.apress || {};
com.apress.view = com.apress.view || {};

com.apress.view.ThoraxTimelineView = Thorax.View.extend({


	template: Handlebars.compile($("#timeline-template").html()),
	

	events: {
		'click .profile': 'showDialog'
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
