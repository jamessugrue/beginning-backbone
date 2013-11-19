
$(function() {
     
var Book = Backbone.Model.extend({});
var Library = Backbone.Collection.extend({}); 

//define contents 
var backboneBook = new Book({name: 'Beginning Backbone', author: 'James Sugrue', year: '2013-12-24'});
var nodeBook = new Book({name: 'Pro Node.js for Developers', author: 'Colin J. Ihrig', year: '2013-11-01'});
var proJavascriptBook = new Book({name: 'Pro JavaScript Techniques', author: 'John Resig', year: '2006-02-01'});



  //Define the Library View
MyView = Backbone.View.extend({
	
	el : '.container',
In
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
	    self.stickit();
		return self;
    }, 
});



var view1 = new MyView({model: backboneBook});
view1.render();

backboneBook.set('name', 'Beginning Backbone.js');

var count = 1; 
setInterval(function(e){ count++; backboneBook.set('name', 'New Name ' + count);}, 6000);


});
