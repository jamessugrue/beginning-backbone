describe("Profile", function() {

	beforeEach(function(){
   		console.log('Any code required for setup');
   		this.profile = new com.apress.model.Profile({id: 'sugrue'});
	});

	it('should have an id', function(){
		expect(this.profile.get('id')).toBe('sugrue');
		expect(this.profile.get('id')).not.toBe('james');

	});


	afterEach(function(){
		console.log('Cleanup code...');
	});

}); 

describe("Timeline", function(){

beforeEach(function(){
   		this.server = sinon.fakeServer.create();

	});


afterEach(function(){
	this.server.restore();
});

it ('Should return some tweets', function(){

  var timeline = new com.apress.collection.Timeline();
  //prepare reponse text
  var timelineResponse = '[{"created_at": "Tue Sep 24 06:23:09 +0000 2013", "text" : "a simulated tweet"},{"created_at": "Tue Sep 24 04:23:09 +0000 2013", "text" : "another simulated tweet"}]';
  //prime the server to respond with particular text on a certain URL
  this.server.respondWith("GET", "/test", [200, {"Content-Type": "application/json"},timelineResponse]);
  //change the url of the collection
  timeline.url = '/test';
  //fetch collection contents
  timeline.fetch({reset: true}); 
  //force the server to respond
  this.server.respond();

  console.log('Timeline has ' + timeline.length);
  expect(timeline.length).toBe(2);

//  ok(timeline.length === 2, 'Correct size of collection');
 // ok(timeline.at(0).get('text') === 'a simulated tweet', 'Correct text in tweet');

});

});
