define(['jquery', 'backbone', 'handlebars','app/model/Profile'], function($, Backbone, Handlebars, Profile) {


var com = com || {};
com.apress = com.apress || {};
com.apress.view = com.apress.view || {};

com.apress.view.ProfilePopupView = Backbone.View.extend({

	template: Handlebars.compile($("#profile-template").html()),

	model: null, 



	initialize:  function(options){
		var self = this; 

		//create a collection for this view to render 
		self.model = new Profile({id: options.user});
		//initial render 
		self.render();	

		//force the fetch to fire a reset event
		self.model.fetch({});

		self.listenTo(self.model, 'change', self.render);
	},



	render: function(){
		var self = this; 

		if(self.model.get('screen_name')){
			var output = self.template({user: self.model.toJSON()});
		
			$.Dialog({
	            'title'       : '@'+self.model.get('screen_name') + 's Profile',
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
			


		return self; 
	},
	

});
	return com.apress.view.ProfilePopupView;
});
