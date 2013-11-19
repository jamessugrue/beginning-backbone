
$(function() {
     
//Model definition
var Book = Backbone.Model.extend({

});


//define contents 
var backboneBook = new Book({name: 'Beginning Backbone', author: 'James Sugrue', year: '2013-12-24'});
var nodeBook = new Book({name: 'Pro Node.js for Developers', author: 'Colin J. Ihrig', year: '2013-11-01'});
var proJavascriptBook = new Book({name: 'Pro JavaScript Techniques', author: 'John Resig', year: '2006-02-01'});


var backboneAttrs = toAttrs(backboneBook);


console.log(backboneAttrs.name());




backboneAttrs.name('Beginning Backbone.js');

console.log(backboneAttrs.name());
console.log(backboneBook.get('name'));

});
