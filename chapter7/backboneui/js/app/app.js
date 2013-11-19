
$(function() {
     
//Model and Collection definitions
var Book = Backbone.Model.extend({});
var Library = Backbone.Collection.extend({}); 

//define contents 
var backboneBook = new Book({name: 'Beginning Backbone', author: 'James Sugrue', year: '2013-12-24'});
var nodeBook = new Book({name: 'Pro Node.js for Developers', author: 'Colin J. Ihrig', year: '2013-11-01'});
var proJavascriptBook = new Book({name: 'Pro JavaScript Techniques', author: 'John Resig', year: '2006-02-01'});

//create collection
var myLibrary = new Library();
myLibrary.set([backboneBook, nodeBook, proJavascriptBook]);



var button = new Backbone.UI.Button({
  model: backboneBook,
  content: 'name'
}).render();

$(".buttoncontainer").append(button.el);



var menu = new Backbone.UI.Menu({
  model: backboneBook,
  content: 'name',
  alternatives: myLibrary,
  altLabelContent: 'name'
}).render();

$(".container").append(menu.el);




});
