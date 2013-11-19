var com = com || {};
com.apress = com.apress || {};
com.apress.view = com.apress.view || {};

com.apress.view.ResultsView = Backbone.View.extend({

	el: '#results',

	model: null,

	template: Handlebars.compile($("#timeline-template").html()),

	initialize:  function(options){
		var self = this; 
		self.model = options.model;

		self.model.fetch({
				error: function(e){
				    self.model.trigger("app:error", {message: 'Error retrieving timeline information'});
				}, 
			success: function(e){
				    self.model.trigger("app:error", {message: 'Error retrieving timeline information'});
				}
		
		});

		self.listenTo(self.model,'change', self.render);

		self.render();
	},

	render: function(){
		console.log('Display now');

		//var resultsArray = self.model.get('statuses');
		var self = this,
			 output = self.template({tweet: self.model.get('statuses')});
		
			$.Dialog({
	            'title'       : 'Search Results',
	            'content'     : output,
	            'draggable'   : true,
	            'overlay'     : true,
	            'closeButton' : true,
	            'buttonsAlign': 'center',
	            'keepOpened'  : true,
	            'position'    : {
	                'zone'    : 'left'
	            },
	            'buttons'     : {
	                'OK'     : {
	                    'action': function(){}
	                }
	            }
	        });
		
			

	}	

});
