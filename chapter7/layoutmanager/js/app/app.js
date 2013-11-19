
$(function() {
     
//very simple view
 var SimpleSubview = Backbone.Layout.extend({
      template: "#view"
    });


var layout = new Backbone.Layout({
	el : '.container', 

	template: '#layout', 

	views: {
		'#subview' : new SimpleSubview()
	},

	beforeRender: function(){
		console.log('About to render');
	}, 

	afterRender: function(){
		console.log('Render completed');
	}
});
layout.render();


});
