# JavaScript Basics 

Some simple code snippets to illustrate some JavaScript features 

## Strings

```javascript 
var doubleQuoteString = "A String in double quotes ";
```

```javascript 
var escapedQuote = 'He said \'hello\';
```

## Numbers
```javascript 
var count = 10;    //number with no decimal places
var cost = 2.99;  //number with two decimal places
var pi = 123e5; //12300000
```

## Dates

```javascript 
var now = new Date();
var calendarString  = now.toDateString();
var time            = now.toTimeString();
```

## Math

```javascript 
var doubleValue = 2.1;
var intValue = Math.ceil(doubleValue); //intValue would now be 3
```

## RegExp
```javascript 
var pattern = new RegExp('javascript','i');
//or 
var pattern = /javascript/i;
```

Patterns can be used as follows 

```javascript 
var myString = 'I love Javascript';
var pattern = new RegExp('javascript', 'i');
var match = myString.match(pattern);
```

