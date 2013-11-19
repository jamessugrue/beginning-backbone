
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



var columns = [ {
  name: "name",
  label: "Name",
  cell: "string" // This is converted to "StringCell" and a corresponding class in the Backgrid package namespace is looked up
 }, {
  name: "author",
  label: "Author",
  cell: "string" 
}, {
  name: "year",
  label: "Year",
  cell: "date",
}];

// Initialize a new Grid instance
var grid = new Backgrid.Grid({
  columns: columns,
  collection: myLibrary
});

// Render the grid and attach the root to your HTML document
$(".container").append(grid.render().$el);

});
