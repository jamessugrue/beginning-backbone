var fixtureEl = null; 
/*
QUnit.begin = function() {
  console.log("Beginning Test Suite");
  fixtureEl = $('#qunit-fixture'); 
  fixtureEl.append('<p id=\'myparagraph\'>New Paragraph</p>');  
};
*/

QUnit.jUnitReport = function(report) {
  console.log('JUNIT...');
    console.log(report.xml);
};

//tests for DOM manipulation
module('Fixture Test', {

  setup: function(){
     fixtureEl = $('#qunit-fixture'); 
     fixtureEl.append('<p id=\'myparagraph\'>New Paragraph</p>');  
  }
});

test('Check for paragraph', function(){

  var results = fixtureEl.find('#myparagraph').length; 
  console.log(fixtureEl);
  console.log(results);
  ok(results === 1, 'Found the correct paragraph');
    
});


module('Equality Tests', {
  setup: function(){
    console.log('setting things up');
  }, 
  teardown: function(){
    console.log('clearing things down');
  }
}); 

test( "Simple Equality Tests", function() {
  ok( 1 == "1", 'Passed simple equals check');
  ok( 1 !== "1", 'Passed really equals check')
  notEqual(1, '2', 'Not Equal');
});

test('More simple tests', function(){
  expect(2);
  equal(true, true, 'Simple true == true test');
  strictEqual(true, true, 'Simple true === true test');
});

module('Another module of tests');

test('Name tests', function(){
  var name = 'James';
  equal(name, 'James', 'Name check test complete');
});

module('Asynchronous Tests'); 

asyncTest("asyncTest", function() {
  expect(1);
 
  var actual = true;
 
  setTimeout(function() {
    ok(actual, "Simple test to prove async");
    start();
  }, 1000);
});