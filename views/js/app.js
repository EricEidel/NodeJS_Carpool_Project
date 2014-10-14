// config require.js

require.config({

    baseUrl: 'lib',

    paths: {
        app: '../js',
        tpl: '../tpl'
    },

    /*map: {
        '*': {
            'app/models/product': 'app/models/memory/product'
        }
    },*/

    shim: {
        'handlebars': {
            exports: 'Handlebars'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        }
    }

});

// init require.js, start listening for hashchange using backbone routes
require(['jquery', 'backbone', 'app/router'], function ($, Backbone, Router) {

    "use strict";

    // create Backbone router and start keeping track of hash state

    var router = new Router();

    Backbone.history.start();

});