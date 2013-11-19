
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


var BookViewModel = Backbone.ViewModel.extend({
  computed_attributes : {
      'truncated_book_title' : function(){
        return this.get('source_model').get('name').substring(0, 10) + '...';
      }, 
      'author' : function(){
            return this.get('source_model').get('author');}
  }
});






  //Define the Library View
MyView = Backbone.View.extend({
  
  el : '.container',

  model : null, 
  content: null, 

  initialize: function(options){
    this.model = options.model; 
  },

  render: function(){
    var self = this; 
    self.$el.html('Author is  ' + this.model.get('author') + ' Title is ' + this.model.get('truncated_book_title'));
   
    return self;
    }, 
});


var backboneBookViewModel = new BookViewModel({source_model: backboneBook});


var view1 = new MyView({model: backboneBookViewModel});
view1.render();



});
