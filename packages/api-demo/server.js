var express = require('express');
var app = express();
var port = 5000;

app.use(express.static('src'));

app.use('/scripts/containerjs-api-bundle', express.static('node_modules/containerjs-api-bundle/build/containerjs-bundle.js'));

app.listen(port);

console.log(`Listening on port ${port}`);
