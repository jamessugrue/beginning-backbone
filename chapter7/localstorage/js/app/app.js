
$(function() {
     
//Model and Collection definitions
var Book = Backbone.Model.extend({});
var Library = Backbone.Collection.extend({
	model: Book,
	localStorage : new Backbone.LocalStorage("MyLibrary"),
}); 

//define contents 
var backboneBook = new Book({name: 'Beginning Backbone', author: 'James Sugrue', year: '2013-12-24'});
var nodeBook = new Book({name: 'Pro Node.js for Developers', author: 'Colin J. Ihrig', year: '2013-11-01'});
var proJavascriptBook = new Book({name: 'Pro JavaScript Techniques', author: 'John Resig', year: '2006-02-01'});

//create collection
var myLibrary = new Library();
myLibrary.create(backboneBook);
myLibrary.create(nodeBook);
//myLibrary.set([backboneBook, nodeBook, proJavascriptBook]);
//myLibrary.sync({});

});
