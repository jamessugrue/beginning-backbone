/*//Name value pair example
require(['Book'], function(book){
	console.log('Title: ' + book.title);
}); 

//Setup function example
require(['SetupBook'], function(book){
	console.log('Title: ' + book.title);
}); 
*/

require(['Mediator'], function(mediator){

	var callback = function(args){
		console.log('Handling name change. Value is ' + args.name);
	}; 

	mediator.subscribe('name.change', callback);

	mediator.notify('name.change', {name: 'Beginning Backbone.js'});

});


require(['Library'], function(library){

	console.log('Library Name: ' + library.name);

	for(var i = 0; i < library.getContents().length; i++){
		console.log('Book: ' + library.getContents()[i].title);
	}
});




