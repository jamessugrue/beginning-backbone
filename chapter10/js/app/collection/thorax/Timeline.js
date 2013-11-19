var com = com || {};
com.apress = com.apress || {};
com.apress.collection = com.apress.collection || {};
com.apress.collection.thorax = com.apress.collection.thorax || {};

com.apress.collection.thorax.Timeline = Thorax.Collection.extend({

	//the model that this collection uses
	model: com.apress.model.thorax.Tweet,
	//the server side url to connect to for the collection
	url: 'http://localhost:8080/timeline',

	initialize: function(options) {
		//anything to be defined on construction goes here
	},



	organiseCollection: function() {
		console.log('organising');
	}



});