'use strict';

var BABEL_CONFIG = require('./config/babel-config.json');
require('babel/register-without-polyfill')(BABEL_CONFIG);
require('./lib/server');
