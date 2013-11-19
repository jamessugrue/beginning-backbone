
$(function() {
     
//Model and Collection definitions
var Book = Backbone.Model.extend({
  validation: 
  {
    name: {
      blank: false,
      message: 'Every book needs a name'
    }, 

  }
});
var Library = Backbone.Collection.extend({}); 

//define contents 
var backboneBook = new Book(); 
console.log('Is this valid? ' + backboneBook.isValid());
backboneBook.set({name: ''}, {validate: true});
console.log(backboneBook.validationError);


  //Define the Library View
MyView = Backbone.View.extend({
  
  el : '.container',

  model : null, 
  content: null, 

  initialize: function(options){
    this.model = options.model; 
    this.bindValidation();
  },

  onInvalidField: function(attrName, attrValue, errors, model){
    alert(attrName + ' has an invalid value');
  },

  render: function(){
    var self = this; 
    self.$el.html('Author is  ' + this.model.get('author') + ' Title is ' + this.model.get('truncated_book_title'));
   
    return self;
    }, 
});




var view1 = new MyView({model: backboneBook});
view1.render();



});
