
$(function() {
     
//Model and Collection definitions
var Book = Backbone.Model.extend({

});
var Library = queryEngine.QueryCollection.extend({
  model: Book,  
}); 



//define contents 
var backboneBook = new Book({name: 'Beginning Backbone', author: 'James Sugrue', year: '2013-12-24'});
var nodeBook = new Book({name: 'Pro Node.js for Developers', author: 'Colin J. Ihrig', year: '2013-11-01'});
var proJavascriptBook = new Book({name: 'Pro JavaScript Techniques', author: 'John Resig', year: '2006-02-01'});
var backboneBook2 = new Book({name: 'Backbone: The Sequel', author: 'James Sugrue', year: '2014-12-01'});

//create collection
var myLibrary = new Library();
myLibrary.set([backboneBook, nodeBook, proJavascriptBook, backboneBook2]);


var results =  myLibrary.findAll({author: 'James Sugrue'});
console.log('Returned ' + results.length + ' results');





});
