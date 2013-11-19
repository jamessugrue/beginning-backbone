
$(function() {
     
var Book = Backbone.Model.extend({
	urlRoot: 'http://localhost:8080/books/',	  

});

//define contents 
var backboneBook = new Book({name: 'Beginning Backbone', author: 'James Sugrue', year: '2013-12-24'});


backboneBook.startTracking(); 


backboneBook.set('name', 'Beginning Backbone.js');
console.log(backboneBook.unsavedAttributes());

backboneBook.set('author', 'J Sugrue');
console.log(backboneBook.unsavedAttributes());

console.log('Author is' + backboneBook.get('author'));
backboneBook.resetAttributes(); 
console.log('Author is' + backboneBook.get('author'));
/*
  //Define the Library View
MyView = Backbone.View.extend({
	
	el : '.container',

	bindings: {
		"#title" : 'name', 
		'#author' : 'author'
	}, 
	model : null, 
	content: null, 

	initialize: function(options){
		this.model = options.model; 
	},

	render: function(){
		var self = this; 
		self.$el.html('<div id="title"/> <input id="author" type="text">');
		return self;
    }, 
});


var view1 = new MyView({model: backboneBook});
view1.render();

backboneBook.set('name', 'Beginning Backbone.js');

var count = 1; 
setInterval(function(e){ 
	count++; backboneBook.set('name', 'New Name ' + count);

}, 6000);
*/

});
