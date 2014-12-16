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
var user = require('./routes/user');

var ibmdb = require('ibm_db');

var passport = require('passport');
var LDAPStrategy = require('./lib/passport-ldap');
var permissions = require('./lib/permissions');

/**
 * Setup the Express engine
**/
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

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

var db_name = "fbservices";
var user_name = "db2inst1";
var password = "1234";
var hostname = "futureblue.torolab.ibm.com";
var port = "50000";

var dsnString = "DRIVER={DB2};DATABASE=" + db_name 
              + ";UID=" + user_name
              + ";PWD=" + password
              + ";HOSTNAME=" + hostname
              + ";port=" + port;

// App.use
app.use(cookieParser()); // Needed for the session part to work
app.use(express_session({secret: 'OMG_bigSecretL33tz0rs', resave: true,	saveUninitialized: true})); // Define a session framework with a "secret"
app.use(express.static(path.join(__dirname, 'views'))); // Makes all the content in "public" accessible
app.use( bodyParser.json() );       // to support JSON-encoded bodies ( {"name":"foo","color":"red"} <- JSON encoding )
app.use( bodyParser.urlencoded({ extended: true }) ); // to support URL-encoded bodies ( name=foo&color=red <- URL encoding )

app.use(passport.initialize());
app.use(passport.session());

// Authentication

// If user is not logged in, go to /, otherwise do the function.
app.get('/', permissions.isUserNotLoggedIn('/test'), function(req, res)
{
	// Only happens if user is not logged in
	res.redirect('/');
});

app.post('/',
  passport.authenticate('ldap', {
    successReturnToOrRedirect: '/test',
    failureRedirect: '/?reason=failed'
  })
);

app.get('/logout', function(req, res){
  req.logout();
  delete req.session.user;
  
  res.redirect('/');
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


// Load home page
app.get('/get_form', index.get_form);
app.post('/post_form', index.post_form);


/**
 * This is where the server is created and run.  Everything previous to this
 * was configuration for this server.
**/
var server = http.createServer(app);
server.listen(app.get('port'), function()
{
	console.log('Express server listening on port ' + app.get('port'));
});



