# Objects 

## Creating Objects 

```javascript 
var myObject = new Object();
myObject.id = 100;
```

The following is equivalent 

```javascript 
var myObject ={id: 100};
```

The id attribute can be retrieved using 

```javascript 
var objectId = myObject.id
```
## Constructors 

```javascript 
function Message  (subject, recipient, content){
        this.subject = subject;
        this.recipient = recipient;
        this.content = content;
}
```

This constructor can now be used as follows: 

```javascript 
var myEmail = new Message('Javascript is cool', 'you@gmail.com', 'Creating objects is simple');
```
## Methods 

```javascript 

function Message  (subject, recipient, content){
        this.subject = subject;
        this.recipient = recipient;
        this.content = content;
         //expose the method
        this.showMessage = showMessage;
        
        function showMessage(){
          console.log('To:' + recipient + 'Subject: ' + subject + 'Message:' + content);
        } 
  }
```

This method can now be used as follows: 

```javascript 
var myEmail = new Message('Javascript is cool', 'you@gmail.com', 'Creating objects is simple');
myEmail.showMessage();
```

## JavaScript Prototype 
 ```javascript 


function Message  (subject, recipient, content){
        this.subject = subject;
        this.recipient = recipient;
        this.content = content;
        }
Message.prototype.show = function(){
        console.log('To:' + this.recipient + 'Subject: ' + this.subject + 'Message:' +
        this.content);
};
var myEmail = new Message('Javascript is cool', 'you@gmail.com', 'Prototype is useful');
myEmail.show();

```

## Encapsulation 
 ```javascript 

Message.prototype = {
        constructor: Message,
        sendMessage: function(){
                        console.log('Sending message to ' + this.recipient);
        },
        show : function(){
                        console.log('To:' + this.recipient + 'Subject: ' + this.subject + 'Message:'
                        + this.content);  
        }   
};
```

```javascript 
var workMessage = new Message('Work complete'', 'boss@mycorp.com', 'My work is done here');
var socialMessage = new Message('Time to go out', 'friend@gmail.com', 'Finished work now.');
workMessage.send();
socialMessage.send();
```


## Inheritance 
 ```javascript 
function Animal(name){
        this.name = name;
}
Animal.prototype.talk = function(){
        console.log(this.phrase);
}
 ```

 ```javascript 
function Dog(phrase){
        this.phrase = phrase;
}
Dog.prototype = new Animal();
var myDog = new Dog('bark');
myDog.talk();
 ```

 ```javascript 
Dog.prototype.constructor = Dog;
 ```
 ```javascript 

function Dog(phrase){
         this.phrase = phrase;this.constructor('Dog');
}
 ```

## Controlling Access to Methods and Properties 

 ```javascript
function Message  (subject, recipient, content){
        //private property
        var privateKey = '11111';
        //private method
        function encryptMessage(content){
        return content || privateKey;
        }
        this.subject = subject;
        this.recipient = recipient;
        this.content = content;
        //expose the method
        this.showMessage = showMessage;
        function showMessage(){
                 console.log('To:' + recipient + 'Subject: ' + subject + 'Message:' + content);
}
        this.sendMessage = sendMessage;
        //public method using a private method
        function sendMessage(){
                 console.log(encryptMessage(this.content));
} }
 ```

 ## Using a Namespace 

 ```javascript
var com = com || {};
com.apress = com.apress || {};
com.apress.chapterone = com.apress.chaptertwo || {};
 ```
 ```javascript
 var myMessage = new com.apress.chapterone.Message(
 //continue message definition 

 ```

