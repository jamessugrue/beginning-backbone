

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        handlebars: {
        	exports: 'Handlebars'
        },
        moment: {
        	exports: 'moment'
        },
        dialog: {
        	exports: 'Dialog'
        },


    },

    paths: {
        jquery: './external/jquery-1.10.2',
        backbone: './external/backbone',
        underscore: './external/underscore',
        handlebars: './external/handlebars',
        moment: './external/moment'

    }
});


require([
    'backbone', 'app/view/TimelineView', 'app/view/ProfileView', 'app/model/Search', 
    'app/view/SearchView', 'app/router/AppRouter', 'app/util/Helpers'
], function (Backbone, TimelineView, ProfileView, Search, SearchView, AppRouter) {


/*
	var timelineView = new com.apress.view.TimelineView(), 
		profileView = new com.apress.view.ProfileView({user: 'sugrue'}),
		searchModel = new com.apress.model.Search(), 
		searchView = new com.apress.view.SearchView({model: searchModel}), 
		appRouter = new com.apress.router.AppRouter({searchModel: searchModel});
	*/
    var timelineView = new TimelineView(), 
		profileView = new ProfileView({user: 'sugrue'}),
		searchModel = new Search(), 
		searchView = new SearchView({model: searchModel}), 
		appRouter = new AppRouter({searchModel: searchModel});
	Backbone.history.start();
    
    console.log('All ok');
});



