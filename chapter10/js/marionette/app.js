$(function() {

	//create a new Marionette Application
	MApp = new Backbone.Marionette.Application();

	//shorthand to add region 
	/*
	MApp.addRegions({
	  mainRegion: '#app'
	});	
	*/

/*	Backbone.Marionette.Renderer.render = function(template, data){
  return template(data);
}*/


	AppRegion = Marionette.Region.extend({
	  el: 'body',
	  onShow: function(view){
	  	console.log('View is shown');
	  }, 

	  onClose: function(view){
	  	console.log('View is closed');
	  }
	});

	MApp.addRegions({
	  mainRegion: AppRegion
	});




	MApp.mainRegion.on("show", function(view){
 		
 		console.log( ' View has been displayed ');
 	});


	MApp.mainRegion.on("close", function(view){
 		
 		console.log( ' View has been closed ');
 	});

//	template: Handlebars.compile($("#timeline-item-template").html()),

/*
MyItemView = Backbone.Marionette.ItemView.extend({
  template:  Handlebars.compile($("#timeline-item-template").html()),

});


//NOW DO THE COMPOSITE OR COLLECTION VIEW 
 MyCollectionView = Backbone.Marionette.CollectionView.extend({
  itemView: MyItemView
});


var collection = new com.apress.collection.Timeline();
//force the fetch to fire a reset event
collection.fetch({
	reset: true, 
	success: function(){
		console.log('Got collection');

		var cv = new MyCollectionView({collection: collection});
		cv.render();
		MApp.mainRegion.show(cv);

	}, 
	error: function(e){
		console.log('No collection');
	}
});
*/
	
	

	//var timelineView = new com.apress.view.MarionetteTimelineView({itemViewOptions: {parameter: 'hello itemview'}}), 
	//profileView = new com.apress.view.MarionetteProfileView({user: 'sugrue'});
		

AppLayout = Backbone.Marionette.Layout.extend({
	//template: Handlebars.compile($("#app-layout-template").html()),
	template: "#app-layout-template",
	regions: {
		timeline: '#timeline-area', 
		profile: '#side'
	}
 
});

var layout = new AppLayout();
MApp.mainRegion.show(layout);




layout.timeline.show(new com.apress.view.MarionetteTimelineView({itemViewOptions: {parameter: 'hello itemview'}}));
layout.profile.show(new com.apress.view.MarionetteProfileView({user: 'sugrue'}));


//	var timelineView = new com.apress.view.MarionetteCompositeTimelineView();
//	MApp.mainRegion.attachView(profileView);







});