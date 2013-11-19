var com = com || {};
com.apress = com.apress || {};
com.apress.model = com.apress.model || {};
com.apress.model.thorax = com.apress.model.thorax || {};

com.apress.model.thorax.Tweet = Thorax.Model.extend({

	parse: function(model) {

		//USE moment here
		//mode.created_at "Wed Aug 28 06:32:07 +0000 2013" 
		var created = model.created_at;
		var friendly = moment(model.created_at, "ddd MMM DD HH:mm:ss ZZ YYYY").fromNow();

		model.friendlyDate = friendly;


		return model;
	}

});