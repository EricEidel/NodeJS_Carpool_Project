define(function (require) {

	"use strict";

	var Backbone = require('backbone'),

		User = Backbone.Model.extend({

			urlRoot: 'http://localhost:3000/user',
			
			defaults : {

				"firstName" : "",

				"lastName" : "",

				"phone" : "",

				"email" : "",

				"userType" : false
			},

			idAttribute: "_id"

		}),

		UserCollection = Backbone.Collection.extend({

			model : User,

			url: "http://localhost:3000/user"
			
		});

	return {

		"User" : User,

		"UserCollection" : UserCollection
	}

});