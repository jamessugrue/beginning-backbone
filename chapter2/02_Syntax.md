# Basic Syntax

## Declaring Variables 

```javascript 
var greeting = 'Hello';
var now = new Date();
```

## Loops and Conditionals 

```javascript 
var userInput = 'run';
if (userInput === 'run'){
   console.log('running application');
}
```

Short form expressions 
```javascript 
var price = 21;
var outputString = (price < 10 ) ? 'Reasonable ' : 'Too Expensive';
console.log(outputString);
```


## Arrays 
Can be created using either of the following
```javascript 
var myArray = [];
var myArray = new Array();
```

Adding items into an array using either the index or push()
```javascript 
myArray[0] = 'first item';
myArray.push('first item');
```

Or create the array with some items included at creation time 
```javascript 
var myArray = new Array('first item', 'second item', 'third item');
```

## Closures
```javascript 

function calculateArea(height, width, shape){
        var pi  = Math.PI;
        //first closure
        function getCircleArea(){
          var circleArea = pi * (height*height);
          return circleArea;
        }
        //second closure
        function getRectangleArea(){
          var area = width * height;
        return area;
        }
        if(shape === 'Circle'){
           	return getCircleArea();
		} 
		else{
			return getRectangleArea();
		} 
	}

```
