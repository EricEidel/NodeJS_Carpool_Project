define(function (require) {

	"use strict";

	// load dependencies
	var $ = require('jquery'),
		Handlebars = require('handlebars'),
		Backbone = require('backbone'),
		HomeTpl = require('text!tpl/home.html'),
		utils = require('app/utils'),
		models = require('app/models/user'),
		User = models.User,
		template = Handlebars.compile(HomeTpl);

	return Backbone.View.extend({

		initialize : function () {
			// constructor, load views, call other methods here
			this.render();
		},

		render : function () {
			// attach element to render views to
			// render template with appropriate models
			this.$el.html(template());
			return this;
		},

		events : {
			// event listeners
			"click #reg-btn": "CreateUser",
			"click #login-btn": "LoginUser"
		},

		//Event listener callbacks
		CreateUser : function (event) {

			event.preventDefault();

			var formData = utils.getFormData('#reg-form'),

				user = new User (formData);

			user.save({

				success : function() {
					alert("saved successfully!");
				},

				error : function (err) {
					alert("error:" + err);
				}

			});

			// prevent form submission, submit async instead 
			return false;
		},

		LoginUser : function () {

			var formData = utils.getFormData('#login-form');
			
			// prevent form submission, submit async instead
			return false;
		}
		
	});

});