/**
 * Module dependencies.
 */
var util = require('util');
var ldap = require('ldapjs');
var passport = require('passport');
var assert = require('assert');
var Q = require('q');

/**
 * `Strategy` constructor.
 *
 * An LDAP authentication strategy authenticates requests by delegating to the
 * given ldap server using the openldap protocol.
 *
 * Applications must supply a `verify` callback which accepts a user `profile` entry
 * from the directory, and then calls the `done` callback supplying a `user`, which
 * should be set to `false` if the credentials are not valid.  If an exception occured,
 * `err` should be set.
 *
 * Options:
 *   - `server`  ldap server connection options - http://ldapjs.org/client.html#create-a-client
 *   - `base`    the base DN to search against
 *   - `search`  an object of containing search options - http://ldapjs.org/client.html#search
 *
 * Examples:
 *
 *     passport.use(new LDAPStrategy({
 *        url: 'ldap://0.0.0.0:1389',
 *        base: 'o=example',
 *        search: {
 *          filter: '(&(l=Seattle)(email=*@foo.com))',
*         }
 *      },
 *      function(profile, done) {
 *        return done(null, profile);
 *      }
 *    ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {
      server: {
        url : ''
      },
      base: '',
      search: {
        filter: ''
      }
    };
  }
  if (!verify) throw new Error('LDAP authentication strategy requires a verify function');

  passport.Strategy.call(this);

  this.name = 'ldap';
  this.createClient = function(){
    return ldap.createClient(options.server);
  }
  this._verify = verify;
  this._options = options;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request by binding to LDAP server, and then searching for the user entry.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
    var self = this;

    var sharedPerson;
    if (!req.body.username || !req.body.password) {
        return self.fail({"message":"Please enter username and password"},400);
    }

    var opts = {
        filter:"(|(mail="+req.body.username+"))",
        scope:"sub"
    }
    var client = self.createClient()
    Q.ninvoke(self,"getPerson",req.body.username,client)
    .then(function(person){
        if(!person){
            console.log("Cannot find user "+req.body.username);
            throw Error("Unabled to find username");
        }else{
            sharedPerson = person;
            return Q.ninvoke(client, "bind", person.dn,req.body.password);
        }
    })
    .then(function(){
        return Q.ninvoke(self, "_verify",sharedPerson);
    })
    .then(function(user){
        if (!user) {
            console.log("Unable to bind user");
            throw Error("Incorrect username or password");
        }
        return user;
    })
    .then(function(user){
        console.log("User logged in ",user)
		req.session.user = user;
		console.log("User logged in (session info)",req.session.user);
		
        return self.success(user);
    },function(err){
        console.log("Login failed ",err)
        return self.fail(401,"FAILURE");
    })
};


Strategy.prototype.getPerson = function(email,client,callback){
    console.log(email);
    var self = this;
    var opts = {
        filter:"(|(mail="+email+"))",
        scope:"sub"
    }

    client.search('ou=bluepages, o=ibm.com',opts,function(err,res){
        if(err)
            callback(err);
        var found = false;
        res.on('searchEntry', function(entry){
            found = true;
            callback(err,entry.object);
        });
        res.on('error', function(err) {
            callback(err);
        });
        res.on('end', function(result) {
            if(!found)
                callback(err,null);
        });
    })
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
