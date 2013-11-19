define(['backbone', 'app/model/Tweet'], function(Backbone, Tweet) {


var com = com || {};
com.apress = com.apress || {};
com.apress.collection = com.apress.collection || {};

com.apress.collection.Timeline = Backbone.Collection.extend({

	//the model that this collection uses
	model: Tweet, 
	//the server side url to connect to for the collection
	url: 'http://localhost:8080/timeline',

	initialize: function(options){
		//anything to be defined on construction goes here
	},



});

	return com.apress.collection.Timeline; 
}); 
