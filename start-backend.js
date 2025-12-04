#!/usr/bin/env node
const path = require('path');
process.chdir(path.join(__dirname, '..', 'cafe-bar-backend'));
require('./server');
