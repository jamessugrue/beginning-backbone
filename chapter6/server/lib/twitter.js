/**
 * node-twitter-api
 * Twitter API 1.1 REST and Streaming client for Node JS
 */


// pseudo constants
//
var TWITTER_API_TIMEOUT             = 10000,
    TWITTER_API_USERAGENT           = 'Node/'+process.version.substr(1)+'; https://github.com/timwhitlock/node-twitter-api',
    TWITTER_API_BASE                = 'https://api.twitter.com/1.1',
    TWITTER_STREAM_BASE             = 'https://stream.twitter.com/1.1',
    TWITTER_OAUTH_REQUEST_TOKEN_URL = 'https://twitter.com/oauth/request_token',
    TWITTER_OAUTH_AUTHORIZE_URL     = 'https://twitter.com/oauth/authorize',
    TWITTER_OAUTH_AUTHENTICATE_URL  = 'https://twitter.com/oauth/authenticate',
    TWITTER_OAUTH_ACCESS_TOKEN_URL  = 'https://twitter.com/oauth/access_token',
    TWITTER_OAUTH2_BEARER_TOKEN_URL = 'https://api.twitter.com/oauth2/token',
    TWITTER_OAUTH2_INVALIDATE_URL   = 'https://api.twitter.com/oauth2/invalidate_token';
    

/**
 * OAuth safe encodeURIComponent of string
 * handles ignored characters that OAuth expects encoded "! * ' ( )"
 */
function uriEncodeString( text ){
    return encodeURIComponent(text).replace( /[\!\*\'\(\)]/g, function( chr ){
        chr = chr.charCodeAt(0).toString(16);
        while( chr.length < 2 ){
            chr = '0'+hex;
        }
        return '%'+chr;
    } )
}


/**
 * OAuth safe encodeURIComponent of params object
 */
function uriEncodeParams( obj ){
    var pairs = [], key;
    for( key in obj ){
        pairs.push( uriEncodeString(key) +'='+ uriEncodeString(obj[key]) );
    }
    return pairs.join('&');
}


/**
 * Simple token object that holds key and secret
 */
function OAuthToken( key, secret ){
    if( ! key || ! secret ){
        throw new Error('OAuthToken params must not be empty');
    }
    this.key = key;
    this.secret = secret;
}

OAuthToken.prototype.getAuthorizationUrl = function(){
    return TWITTER_OAUTH_AUTHORIZE_URL+'?oauth_token='+encodeURIComponent(this.key);
}

OAuthToken.prototype.getBasicAuthHeader = function(){
    var creds = new Buffer( encodeURIComponent(this.key)+':'+encodeURIComponent(this.secret) );
    return 'Basic '+ creds.toString('base64');
}




/**
 * Object for compiling, signing and serializing OAuth parameters
 */
function OAuthParams( args ){
    this.bearer_token = '';
    this.consumer_secret = '';
    this.token_secret = '';
    this.args = args || {};
}

OAuthParams.prototype.setBearer = function( bearer ){
    this.bearer_token = bearer;
    delete this.args.oauth_version;
    return this;
}
    
OAuthParams.prototype.setConsumer = function( token ){
    this.consumer_secret = token.secret||'';
    this.args.oauth_consumer_key = token.key||'';
    this.args.oauth_version = '1.0';
    return this;
}
   
OAuthParams.prototype.setAccess = function ( token ){
    this.token_secret = token.secret||'';
    this.args.oauth_token = token.key||'';
    return this;
}   
    
OAuthParams.prototype.normalize = function(){
    var i, k, keys = [], sorted = {};
    for( k in this.args ){
        keys.push(k);
    }
    keys.sort();
    for( i in keys ){
        k = keys[i];
        sorted[k] = this.args[k];
    }
    return this.args = sorted;
}    

OAuthParams.prototype.serialize = function(){
    return uriEncodeParams( this.args );
}
    
OAuthParams.prototype.sign = function( requestMethod, requestUri ){
    var ms = Date.now(),
        s  = Math.round( ms / 1000 );
    this.args.oauth_signature_method = 'HMAC-SHA1';
    this.args.oauth_timestamp = String(s);
    this.args.oauth_nonce = String(ms);
    delete this.args.oauth_signature;
    // normalize, build and sign
    this.normalize();
    var str  = requestMethod.toUpperCase() +'&'+ uriEncodeString(requestUri) +'&'+ uriEncodeString(this.serialize()),
        key  = uriEncodeString(this.consumer_secret) +'&'+ uriEncodeString(this.token_secret),
        hash = require('crypto').createHmac('sha1',key).update(str);
    this.args.oauth_signature = hash.digest('base64');
    return this;
}

OAuthParams.prototype.getHeader = function(){
    // OAuth 2
    if( this.bearer_token ){
        return 'Bearer '+encodeURIComponent(this.bearer_token);
    }
    // OAuth 1
    var a, args = {}, lines = [];
    for( a in this.args ){
        if( 0 === a.indexOf('oauth_') ){
            lines.push( encodeURIComponent(a) +'='+ encodeURIComponent(this.args[a]) );
        }
        else {
            args[a] = this.args[a];
        }
    }
    this.args = args;
    return 'OAuth '+lines.join(',\n ');
}







/**
 * Twitter API 1.1 client
 */
function TwitterClient(){
    this.deAuth();
}

TwitterClient.prototype.setProxy = function(proxy) {
    this.proxy = proxy;
}

TwitterClient.prototype.getLastMeta = function( method ){
    return this.lastMeta[ method || this.lastCall ] || { limit: 0, remaining: 0, reset: 0 };
}

TwitterClient.prototype.getRateLimit = function( method ){
    return this.getLastMeta(method).limit;
}

TwitterClient.prototype.getRateLimitRemaining = function( method ){
    return this.getLastMeta(method).remaining;
}

TwitterClient.prototype.getRateLimitReset = function( method ){
    return new Date( this.getLastMeta(method).reset * 1000 );
}

TwitterClient.prototype.setAuth = function( consumerOrBearer, consumerSecret, accessKey, accessSecret ){
    this.deAuth();
    // OAuth 2
    if( 1 === arguments.length ){
        this.bearerToken = consumerOrBearer;
        return this;
    }
    // OAuth 1
    this.consumerToken = new OAuthToken( consumerOrBearer, consumerSecret );
    if( accessKey || accessSecret ){
        this.accessToken = new OAuthToken( accessKey, accessSecret );
    }
    return this;
}

TwitterClient.prototype.hasAuth = function(){
    return ( this.bearerToken && this.bearerToken.length ) || ( this.accessToken instanceof OAuthToken ) && ( this.consumerToken instanceof OAuthToken );
}

TwitterClient.prototype.deAuth = function(){
    this.bearerToken = null;
    this.consumerToken = null;
    this.accessToken = null;
    // register rate limits for all REST calls
    this.lastCall = null;
    this.lastMeta = {};
    return this;
}

TwitterClient.prototype.get = function( requestPath, requestArgs, callback ){
    return this._rest( 'GET', requestPath, requestArgs, callback );
}

TwitterClient.prototype.post = function( requestPath, requestArgs, callback ){
    return this._rest( 'POST', requestPath, requestArgs, callback );
}

TwitterClient.prototype._rest = function( requestMethod, requestPath, requestArgs, callback ){
    if( ! this.hasAuth() ){
        throw new Error('Twitter REST client not authenticated');
    }
    var requestUri = TWITTER_API_BASE + '/' + requestPath + '.json';
    if( 'function' !== typeof callback ){
        callback = function(){
            console.error('No callback for '+requestMethod+' '+requestUri);
        }
    }
    this.lastCall = requestPath;
    var client = this;
    return this._call( requestMethod, requestUri, requestArgs, '', TWITTER_API_TIMEOUT, function( res, err ) {
        if( ! res ){
            callback( null, err, 0 );
            return;
        }
        // started to receive response from twitter
        res.setEncoding('utf8');
        var body = '';
        res.on('data', function( chunk ) {
            body += chunk;
        } );
        res.on('end', function(){
            try {
                var error = null,
                    data = JSON.parse(body);
                if( 'object' !== typeof data ){
                    throw { message: 'Malformed response from Twitter', code: 0 };
                }
                if( data.errors && data.errors.length ){
                    throw data.errors.pop();
                }
            }
            catch( e ){
                error = e;
                data = null;
                console.error( 'Twitter responded status '+res.statusCode );
                console.error( e.message || String(e) || 'Unknown error' );
            }
            if( 'function' === typeof callback ){
                callback( data, error, res.statusCode );
            }
        } );
        // remember last rest call
        // pull rate limit data from headers
        var limit = res.headers['x-rate-limit-limit'];
        if( limit ){
            client.lastMeta[ client.lastCall ] = {
                limit:     Number( limit ),
                remaining: Number( res.headers['x-rate-limit-remaining'] ),
                reset:     Number( res.headers['x-rate-limit-reset'] )
            }
        }
    } );
}

TwitterClient.prototype.stream = function( requestPath, requestArgs, callback ){
    if( ! this.hasAuth() ){
        throw new Error('Twitter streaming client not authenticated');
    }
    var requestMethod = 'GET',
        requestUri = TWITTER_STREAM_BASE+'/'+requestPath+'.json';
    if( 'user' === requestPath ){
        requestUri = requestUri.replace('stream','userstream');
    }
    else if( 'site' === requestPath ){
        requestUri = requestUri.replace('stream','sitestream');
    }
    else if( 0 === requestPath.indexOf('statuses/filter') ){
        requestMethod = 'POST';
    }
    if( 'function' !== typeof callback ){
        callback = function( json ){
            json && console.log( json );
        };
    }
    var client = this;
    return this._call( requestMethod, requestUri, requestArgs, '', 0, function( res, err ){
        if( ! res ){
            callback( null, err );
            return;
        }
        client.response = res;
        res.setEncoding('utf8');
        if( 200 !== res.statusCode ){
            console.error( 'Error '+res.statusCode );
            client.abort();
        }
        res.on('data', function( chunk ) {
            // simple sniff for valid json and call back
            if( '{' == chunk.charAt(0) && '}\r\n' === chunk.substr(-3) ){
                callback( chunk );
            }
        } );
        res.on('end', function(){
            client.response = null;
        } );
    } );
}

TwitterClient.prototype._call = function( requestMethod, requestUri, requestArgs, authHeader, timeout, callback ){
    requestMethod = String( requestMethod||'GET' ).toUpperCase();
    // build and sign request parameters
    var params = new OAuthParams( requestArgs );
    if( this.bearerToken ){
        params.setBearer( this.bearerToken );
    }
    else {
        this.consumerToken && params.setConsumer( this.consumerToken );
        this.accessToken && params.setAccess( this.accessToken );
    }
    // grab authorization header and any remaining params
    if( ! authHeader ){
        params.sign( requestMethod, requestUri );
        authHeader = params.getHeader();
    }
    var query = params.serialize();
    
    // build http request starting with parsed endpoint
    var http = require('url').parse( requestUri );
    http.headers = { 
        Authorization: authHeader,
        'User-Agent': TWITTER_API_USERAGENT 
    };
    http.method = requestMethod;
    if( 'POST' === requestMethod ){
        http.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        http.headers['Content-Length'] = query.length;
    }
    else if( query ){
        http.path += '?' + query;
    }
    // configure proxy
    if (typeof this.proxy == "object") {
        if (typeof this.proxy.host != "undefined") {
            http.host = this.proxy.host;
            http.path = "https://" + http.hostname + http.path;
            delete http.hostname;
        }
        if (typeof this.proxy.port != "undefined") {
            http.port = this.proxy.port;
        }
    }
    var req = require('https').request( http, callback );
    req.setSocketKeepAlive( true );
    if( timeout ){
        req.on('socket', function (socket) {
            socket.setTimeout( timeout );  
            socket.on('timeout', function() {
                console.error('Request timeout in '+requestUri);
                req.abort();
            } );
        } );
    }
    req.on('error', function( e ) {
        console.error( String(e) );
        callback( null, e );
    } );
    if( 'POST' === requestMethod && query ){
        req.write( query );
        req.write( '\n' );
    }
    req.end();
    return this;
}

TwitterClient.prototype.abort = function(){
    try {
        if( this.response ){
            this.response.destroy();
            this.response = null;
        }
    }
    catch( e ){
        console.error( e.message || String(e) || 'Unknown error on abort' );
    }
}

TwitterClient.prototype.fetchRequestToken = function( url, callback ){
    var requestUri  = TWITTER_OAUTH_REQUEST_TOKEN_URL,
        requestArgs = { oauth_callback: url||'oob' };
    return this._oauthExchange( requestUri, requestArgs, '', callback );
}

TwitterClient.prototype.fetchAccessToken = function( verifier, callback ){
    var requestUri  = TWITTER_OAUTH_ACCESS_TOKEN_URL,
        requestArgs = { oauth_verifier: verifier };
    return this._oauthExchange( requestUri, requestArgs, '', callback );
}

TwitterClient.prototype.fetchBearerToken = function( callback ){
    var requestUri  = TWITTER_OAUTH2_BEARER_TOKEN_URL,
        requestArgs = { grant_type: 'client_credentials' },
        authHeader  = this.consumerToken.getBasicAuthHeader();
    return this._oauthExchange( requestUri, requestArgs, authHeader, callback );
}

TwitterClient.prototype.invalidateBearerToken = function( bearer, callback ){
    var requestUri  = TWITTER_OAUTH2_INVALIDATE_URL,
        requestArgs = { access_token: bearer },
        authHeader  = this.consumerToken.getBasicAuthHeader();
    return this._oauthExchange( requestUri, requestArgs, authHeader, callback );
}

TwitterClient.prototype._oauthExchange = function( requestUri, requestArgs, authHeader, callback ){
    if( 'function' !== typeof callback ){
        callback = function(){
            console.error('No callback for POST '+requestUri);
        }
    }
    this._call( 'POST', requestUri, requestArgs, authHeader, TWITTER_API_TIMEOUT, function( res, err ){
        if( ! res ){
            callback( null, err||{}, 0 );
            return;
        }
        // started to receive response from twitter
        res.setEncoding('utf8');
        var body = '';
        res.on('data', function( chunk ) {
            body += chunk;
        } );
        res.on('end', function(){
            var token, 
                params = 0 === body.indexOf('{') ? JSON.parse(body) : body.require('querystring').parse(body);
            if( 'bearer' === params.token_type ){
                token = decodeURIComponent( params.access_token );
            }
            else if( params.oauth_token && params.oauth_token_secret ){
                token = new OAuthToken( params.oauth_token, params.oauth_token_secret );
            }
            callback( token, params, res.statusCode );
        } );
    } );
}




// expose object creation methods to module

exports.createOAuthParams = function( args ){
    return new OAuthParams( args );
}


exports.createOAuthToken = function( key, secret ){
    return new OAuthToken( key, secret );
}


exports.createClient = function(){
    return new TwitterClient;
}


// expose some configuration setters

exports.setTimeout = function( ms ){
    ms = Number(ms);
    if( ! isNaN(ms) ){
        TWITTER_API_TIMEOUT = ms;
    }
    return exports;
}

