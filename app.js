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
var passport = require('passport');
var LDAPStrategy = require('./lib/passport-ldap');
var permissions = require('./lib/permissions');

var routes = require('./routes');
var user = require('./routes/user');
var index = require('./routes/index');

var ibm_db = require('ibm_db');
/**
 * Setting up the authontication
**/
passport.use(new LDAPStrategy({
    server: {
      url: 'ldaps://bluepages.ibm.com:636'
    },
    base: 'o=ibm.com,ou=bluepages',
    search: {
      filter: 'ou=bluepages,o=ibm.com',
     },
    debug:true
  },
  function(person, done) {
    return done(null, {
        username:person.mail,
        provider:"ldap",
        id: person.serialNumber || person.uid,
        notesId : person.notesId,
        cn: person.cn,
        displayName: person.callupName
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
      done(null,user);
});

/**
 * Setup the Express engine
**/
var app = express();

app.set('port', process.env.PORT || 80);
app.set('view engine', 'ejs');


/* comment */

// App.use
app.use(cookieParser()); // Needed for the session part to work
app.use(express_session({secret: 'OMG_bigSecretL33tz0rs', resave: true,	saveUninitialized: true})); // Define a session framework with a "secret"
app.use(express.static(path.join(__dirname, 'public'))); // Makes all the content in "public" accessible
app.use( bodyParser.json() );       // to support JSON-encoded bodies ({"name":"foo","color":"red"} <- JSON encoding)
app.use( bodyParser.urlencoded({ extended: true }) ); // to support URL-encoded bodies (name=foo&color=red <- URL encoding)

app.use(passport.initialize());
app.use(passport.session());


// Authentication

app.post('/log_in',
  passport.authenticate('ldap', {
    successReturnToOrRedirect: '/landing_page',
    failureRedirect: '/?reason=failed'
  })
);

app.get('/logout', function(req, res){
  req.logout();
  delete req.session.user;
  
  res.redirect('/');
});

app.get('/landing_page', function(req, res){
	if (!req.session.user)
		res.redirect('/');
	else
		res.render('landingPage');
});

app.get('/create_group', function(req, res){
//	if (!req.session.user)
//		res.redirect('/');
//	else
		res.render('create_group');
});

app.post('/create_group', function(req, res){
//	if (!req.session.user)
//		res.redirect('/');
//	else
//	{
		index.post_form(req, res);
//	}
});


// Sessions examples
app.get('/set', function(req, res)
{
	req.session.userName = req.user.userName;
	res.redirect('/test');
});

app.get('/unset', function(req, res)
{
	delete req.session.userName;
	res.redirect('/test');
});

app.get('/test', function(req, res)
{
	if (req.session.user)
	{
		res.write(req.session.user.username);
		res.write(req.session.user.cn[0]);
	}
	else
		res.write("No user logged in");

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



