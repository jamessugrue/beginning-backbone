define(['backbone'], function(Backbone) {

var com = com || {};
com.apress = com.apress || {};
com.apress.model = com.apress.model || {};

com.apress.model.Profile = Backbone.Model.extend({

	urlRoot: 'http://localhost:8080/profile', 

	
	parse: function(model){
	
		return model;
	}

});	
	return com.apress.model.Profile;

}); 