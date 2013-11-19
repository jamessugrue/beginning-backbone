$(function() {


//STEP 1 - a simple view - note that properties included in the view are also available to the handlebars template
/*
var view = new Thorax.View({
  label: "Title",
  template: Handlebars.compile( "{{label}} : {{bookname}}"), 
   
  model: new Thorax.Model({
    bookname: 'Beginning Backbone'
  }),
});

view.appendTo('body');
*/

//STEP 2- Using Context to enchance your model - note that only attributes exposed in the context are available to the template 
/*
var view = new Thorax.View({
  model: new Thorax.Model({
    bookname: 'Beginning Backbone', 
    author: 'James Sugrue'
  }),
  label: 'Title',
  context: function() {
    return {
      bookname: this.model.get('bookname').toUpperCase()
    };
  },
  template: Handlebars.compile( "{{label}} : {{bookname}} by {{author}}"), 
});

view.appendTo('body');

*/

//STEP 3 - Embedded Views - note how the view helper renders the subview
/*
var subview = new Thorax.View({
  model: new Thorax.Model({
    description: 'A book to help you get started with Backbone.js', 
   }),
  template: Handlebars.compile( "{{description}}"), 
});


var view = new Thorax.View({
  model: new Thorax.Model({
    bookname: 'Beginning Backbone', 
    author: 'James Sugrue'
  }),
  label: 'Title',
  context: function() {
    return {
      bookname: this.model.get('bookname').toUpperCase()
    };
  },
  subview: subview,
  template: Handlebars.compile( "{{label}} : {{bookname}} by {{author}} <br/> {{view subview}}"), 
});

view.appendTo('body');

*/

//STEP 4: Layouts - Create a simple view and watch the lifecyle (ready -> rendered)
/*
//Append layout to the body 
var layout = new Thorax.LayoutView();
layout.appendTo('body');


var view = new Thorax.View({
  events: {
    ready: function() { console.log('View is ready');},
    destroyed: function() { console.log('View is destroyed');},
    rendered: function() {console.log('View is rendered');}
  }, 
  model: new Thorax.Model({
    bookname: 'Beginning Backbone', 
    author: 'James Sugrue'
  }),
  
  template: Handlebars.compile( "{{bookname}} by {{author}}"), 
});
layout.setView(view);

//replacing with this view. Original view is destroyed
var replacementView = new Thorax.View({
  events: {
    ready: function() { console.log('Replacement View is ready');},
    destroyed: function() { console.log('Replacement View is destroyed');},
    rendered: function() {console.log('Replacement View is rendered');}
  }, 
  model: new Thorax.Model({
    bookname: 'Beginning Backbone', 
    author: 'James Sugrue'
  }),
  
  template: Handlebars.compile( "{{bookname}}"), 
});


layout.setView(replacementView);
*/


//STEP 5: Convert a model and use the existing profile view 

var profileModel = new com.apress.model.thorax.Profile({id: 'sugrue'});
//ensure we have the model before rendering
profileModel.fetch({success: function(){
				
				//get the profile model first 
				var profileView = new com.apress.view.ThoraxProfileView({model: profileModel});

				profileView.appendTo('#profile');

			}
		});


//STEP 6: Use a collection view for the timeline 

var timeline = new com.apress.collection.thorax.Timeline();
//force the fetch to fire a reset event
timeline.fetch({reset:true, success: function(){
	var timelineView = new com.apress.view.ThoraxTimelineView({collection: timeline});	
	timelineView.appendTo('#timeline-section');
}});




});