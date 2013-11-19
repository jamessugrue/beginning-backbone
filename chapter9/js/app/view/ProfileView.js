var com = com || {};
com.apress = com.apress || {};
com.apress.view = com.apress.view || {};

com.apress.view.ProfileView = Backbone.View.extend({

	el: '#profile',

	template: Handlebars.compile($("#profile-template").html()),

	model: null,

	initialize: function(options) {
		var self = this;

		//create a collection for this view to render 
		self.model = new com.apress.model.Profile({
			id: options.user
		});
		//initial render 
		self.render();

		//force the fetch to fire a reset event
		self.model.fetch({});

		self.listenTo(self.model, 'change', self.render);
	},



	render: function() {
		var self = this;

		if (self.model.cid) {
			var output = self.template({
				user: self.model.toJSON()
			});

			self.$el.html(output);
		}
		return self;
	},


});