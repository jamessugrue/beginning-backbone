var com = com || {};
com.apress = com.apress || {};
com.apress.view = com.apress.view || {};

com.apress.view.ThoraxProfileView = Thorax.View.extend({

	el: '#profile',

	template: Handlebars.compile($("#profile-template").html()),

});
