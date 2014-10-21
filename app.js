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
var bodyParser = require('body-parser')

// My adapter
var modelAdapter = require('./models/adapter');

/**
 * Setup the Express engine
**/
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

// Stuff to do for all routes
app.use(cookieParser()); // Needed for the session part to work
app.use(express_session({secret: 'OMG_bigSecretL33tz0rs', resave: true,	saveUninitialized: true})); // Define a session framework with a "secret"
app.use(express.static(path.join(__dirname, 'views'))); // Makes all the content in "public" accessible
app.use( bodyParser.json() );       // to support JSON-encoded bodies ({"name":"foo","color":"red"} <- JSON encoding)
app.use( bodyParser.urlencoded({ extended: true }) ); // to support URL-encoded bodies (name=foo&color=red <- URL encoding)

app.get('/log_in', function (req, res)
{
	req.session.userName = 'omg';
	res.render('home.ejs');
});

app.get('/set', function(req, res)
{
	req.session.userName = 'omg';
	res.redirect('/test');
});

//commit

app.get('/unset', function(req, res)
{
	delete req.session.userName;
	res.redirect('/test');
});

app.post('/test', function(req, res)
{
	var name = req.body.name;
	res.write(name + '\n');
	res.end();
});

app.get('/test', function(req, res)
{
	res.write('this is the test page!\n');
	res.write(__dirname + '<br>');
	if (req.session.userName)
		res.write(req.session.userName);
	res.end();
});


/**
 * This is where the server is created and run.  Everything previous to this
 * was configuration for this server.
**/
var server = http.createServer(app);
server.listen(app.get('port'), function()
{
	console.log('Express server listening on port ' + app.get('port'));
});



