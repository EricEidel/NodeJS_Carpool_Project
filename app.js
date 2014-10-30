/*jslint node:true*/
/*eslint no-unused-params:0*/
/* These lines are hints to the code editor */

/**
 * Load the appropriate modules for our web application
*/
var http = require('http');
var path = require('path');
var express = require('express');   // The ExpressJS framework
var cookieParser = require('cookie-parser');
var express_session = require('express-session'); 
var bodyParser = require('body-parser');
var routes = require('./routes');
var index = require('./routes/index');

var ibmdb = require('ibm_db');
/**
 * Setup the Express engine
**/
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

/* Get the database stuff */
var serviceName = 'SQLDB';

/*
 * Recursively iterate through the object looking for the key, 
 * return the index
 */
function findKey(obj,lookup) 
{
   for (var i in obj) 
   {
      if (typeof(obj[i])==="object") 
      {
         if (i.toUpperCase().indexOf(lookup) > -1) 
         {
            // Found the key
            return i;
         }
         findKey(obj[i],lookup);
      }
   }
   return -1;
}

var env = null;
var key = -1;

// Look for an entry in the VCAP_SERVICES environment variable that has 
// the serviceName string in it
if (process.env.VCAP_SERVICES) 
{
   env = JSON.parse(process.env.VCAP_SERVICES);
   key = findKey(env,serviceName);
}
var credentials = null;
if (env != null)
	 credentials = env[key][0].credentials;

var dsnString = null;

if (credentials != null)	
	dsnString = "DRIVER={DB2};DATABASE=" + credentials.db + ";UID=" + credentials.username + ";PWD=" + credentials.password + ";HOSTNAME=" + credentials.hostname + ";port=" + credentials.port;     

// App.use
app.use(cookieParser()); // Needed for the session part to work
app.use(express_session({secret: 'OMG_bigSecretL33tz0rs', resave: true,	saveUninitialized: true})); // Define a session framework with a "secret"
app.use(express.static(path.join(__dirname, 'views'))); // Makes all the content in "public" accessible
app.use( bodyParser.json() );       // to support JSON-encoded bodies ( {"name":"foo","color":"red"} <- JSON encoding )
app.use( bodyParser.urlencoded({ extended: true }) ); // to support URL-encoded bodies ( name=foo&color=red <- URL encoding )


// Load home page
app.get('/', index.get_form);
app.post('/', index.post_form);


/**
 * This is where the server is created and run.  Everything previous to this
 * was configuration for this server.
**/
var server = http.createServer(app);
server.listen(app.get('port'), function()
{
	console.log('Express server listening on port ' + app.get('port'));
});



