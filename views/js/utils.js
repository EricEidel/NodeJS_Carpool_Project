// utils.js - user-defined helper methods

// self-excecuting function 
define(function (require) {

	"use strict";

	var $ = require('jquery');

	var getFormData = function (form) {

		var json = {};

		//get form data
		var data = $(form).serializeArray();
		
		$.each(data, function (index) {

			var formObject = data[index];
			var key = formObject.name;
			var value = formObject.value;

			if (key == "userType")
				value = (formObject.value == "owner") ? true : false

			if (key != "terms")
				json[key] = value;

		});
		
		return json;	
	}


	// public api

	return {

		// extract form data as JSON object
		getFormData : getFormData

	}

});