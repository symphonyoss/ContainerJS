const containerSetup = require('./test-container-setup');
const containerjsTests = require('containerjs-api-tests');
const mocha = require('mocha');

containerjsTests(containerSetup, mocha);
