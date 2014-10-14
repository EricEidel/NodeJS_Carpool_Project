define(function (require) {

	"use strict";

	// load dependencies
	var $ = require('jquery'),
		Backbone = require('backbone'),
		LandingView = require('app/views/LandingView'),
		landingView = new LandingView ();

	return Backbone.Router.extend({

		routes : {
			
			"": "landing",
			"home" : "home"
		},

		landing : function() {
			// delegate event listeners, and then render the home view
			landingView.delegateEvents();

			// Todo: check for sessions, and render landing(sign up)/home page respectively
			// i.e. route based on login information
			$('body').html(landingView.$el);
			$('#nav-bar').hide().fadeIn(500);
			$('[id=animate-right]').animate({right: 0}, 500);
			$('[id=animate-left]').animate({left: 0}, 500);
		}

	});
});