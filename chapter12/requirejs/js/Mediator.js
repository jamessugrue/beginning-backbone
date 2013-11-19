define( function(){

		//a list of channels, which itself has a list of subscribers
		var channels = [];

		var publish  = function(eventType, params){
			//find subscribers 
			if(channels[eventType]){
				for(var i= 0; i < channels[eventType].length; i++){
					var channel = channels[eventType][i];
					channel.callback.call(channel.context, params);
							
				}
			}
		};

        return {
            subscribe: function(eventType, callback){
            	if(!channels[eventType]){
            		channels[eventType] = [];
            	}
            	channels[eventType].push({context: this, callback: callback});
            },
            notify: function(eventType, params){
            	publish(eventType, params);
            }
        }
    }
);