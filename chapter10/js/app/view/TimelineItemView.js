var com = com || {};
com.apress = com.apress || {};
com.apress.view = com.apress.view || {};

com.apress.view.TimelineItemView = Backbone.Marionette.ItemView.extend({

	//el: '#timeline',
	template: Handlebars.compile($("#timeline-item-template").html()),
	tagName: 'li',

	events: {
		'click .profile': 'showDialog'
	},

    initialize: function(options){

    	//console.log('Initialized with ' + JSON.stringify(options));
    },

	showDialog: function(options) {

		var self = this,
			$target = $(options.currentTarget),
			username = $target.data('user');

		var profileView = new com.apress.view.ProfilePopupView({
			user: username
		});
	},




});