var fixtureEl = null; 
var Tweet = new com.apress.model.Tweet();

//tests for DOM manipulation
module('Model Tests: Tweet');

test('Check initialization parameters', function(){

  expect(2); 

  //create a new instance of a Tweet model 
  var user = {name: 'James'};
  var tweet = new com.apress.model.Tweet({user: user, text: 'Hello World'});


  equal(tweet.get("text"), "Hello World", "Tweet text set correctly");
  equal(tweet.get("user").name, "James", "User name object set correctly");




});


module('Sinon Stubs', {

  setup:function() {

     this.tweetModel = new com.apress.model.Tweet({user: {name: 'James'}, text: 'Hello World'});
      sinon.stub(this.tweetModel, 'save', 
      function(cb){ //SAVE STUB HERE
       });

  }
  

});


test('Use a stubbed save function', function(){
  expect(0);
  console.log(this.tweetModel.save());


});



module('View Tests: Profile');
asyncTest( "asynchronous view tests", function() {
  
  this.clock.restore(); 
  expect( 3 );


  var profileView = new com.apress.view.ProfileView({user: 'sugrue'});
  
  this.spy(profileView, 'render');
 
  profileView.render();
  
  ok(profileView.render.calledOnce, 'Profile view render function executed once');

  ok(profileView.render.calledWith(), 'Profile view render called with no parameters');


  setTimeout(function() {
  

    equal(profileView.$('h3').text(), "James Sugrue", "Profile view rendered with correct name");
    start();
  }, 1000);
});



module('Sinon Mocks', {


});


test('Use a mock collection', function(){
  expect(1);


  var collection = new com.apress.collection.Timeline();
  //mock the collection
  var mock = sinon.mock(collection);
  mock.expects('organiseCollection').atLeast(1);
  
  collection.organiseCollection();

  mock.verify(); 
 });



module('Fake server');

test('Use fake server', function(){

  expect(2);
  //set up a fake server
  var server = this.sandbox.useFakeServer();
  var timeline = new com.apress.collection.Timeline();
  //prepare reponse text
  var timelineResponse = '[{"created_at": "Tue Sep 24 06:23:09 +0000 2013", "text" : "a simulated tweet"},{"created_at": "Tue Sep 24 04:23:09 +0000 2013", "text" : "another simulated tweet"}]';
  //prime the server to respond with particular text on a certain URL
  server.respondWith("GET", "/test", [200, {"Content-Type": "application/json"},timelineResponse]);
  //change the url of the collection
  timeline.url = '/test';
  //fetch collection contents
  timeline.fetch({reset: true}); 
  //force the server to respond
  server.respond();

 // console.log('Timeline has ' + timeline.length);

  ok(timeline.length === 2, 'Correct size of collection');
  ok(timeline.at(0).get('text') === 'a simulated tweet', 'Correct text in tweet');

});



