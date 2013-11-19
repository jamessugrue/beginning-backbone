var com = com || {};
com.apress = com.apress || {};
com.apress.model = com.apress.model || {};
com.apress.model.thorax = com.apress.model.thorax || {};

com.apress.model.thorax.Profile = Thorax.Model.extend({

	urlRoot: 'http://localhost:8080/profile',


	parse: function(model) {
		return model;
	}

});