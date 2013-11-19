
$(function() {
     
	var timelineView = new com.apress.view.TimelineView(), 
		profileView = new com.apress.view.ProfileView({user: 'sugrue'}),
		searchModel = new com.apress.model.Search(), 
		searchView = new com.apress.view.SearchView({model: searchModel}), 
		appRouter = new com.apress.router.AppRouter({searchModel: searchModel});

  	Backbone.history.start();

});
