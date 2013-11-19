
$(function() {
     
var Book = Backbone.Model.extend({
	urlRoot: 'http://localhost:8080/books/',
	initialize: function(){
		var memento = new Backbone.Memento(this); 
		_.extend(this, memento);
	}  

});

//define contents 
var backboneBook = new Book({name: 'Beginning Backbone', author: 'James Sugrue', year: '2013-12-24'});

console.log('Before set: ' + backboneBook.get('name'));
backboneBook.set('name', 'Beginning Backbone.js');
backboneBook.store();

console.log('After store: ' + backboneBook.get('name'));
backboneBook.set('name', 'Beginning Backbone')
console.log('After set: ' + backboneBook.get('name'));
backboneBook.restore();
console.log('After restore: ' + backboneBook.get('name'));

});
