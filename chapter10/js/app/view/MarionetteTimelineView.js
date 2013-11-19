var com = com || {};
com.apress = com.apress || {};
com.apress.view = com.apress.view || {};

com.apress.view.MarionetteTimelineView = Backbone.Marionette.CollectionView.extend({


	el: '#timeline-list',
	itemView : com.apress.view.TimelineItemView,


	initialize: function(options) {
		var self = this;

		self.itemView =  com.apress.view.TimelineItemView;

		//create a collection for this view to render 
		self.collection = new com.apress.collection.Timeline();
		//initial render 
		//self.render();

		//force the fetch to fire a reset event
		self.collection.fetch({
			reset: true
		});

		self.listenTo(self.collection, 'reset', self.render);

	}



});

