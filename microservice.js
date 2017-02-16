'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var fs = require('fs');

var TokenService = require('./src/TokenService');

var myPublicKey = fs.readFileSync('config/public.pem');
var myPrivateKey = fs.readFileSync('config/privateKey.pem');

var tokenService = new TokenService(myPublicKey, myPrivateKey);


var requiredPermissions = function(permissionsArray) {
  var lexJWT = req.cookies.ls_token;

  if (!lexJWT) {
    res.send('Auth token required');
    return;
  }
  var verification = tokenService.verifyJWT(lexJWT);

  if (verification.name) {
    res.send(`failed token verification: ${verification}`);
    return;
  }

  var permissions = verification.body.data.permissions;

  if (permissions.includes('viewData')) {
    res.send('valuable notes etc');
  } else {
    res.send('Permission denied');
  }

}
/**
 * Create the Express application.
 */
var app = express();

app.set('json spaces', 2);

app.use(cookieParser());

app.get('/', function(req, res) {
  res.send('Hi, I\'m a microservice! I have data on /data');
});

app.get('/data', function(req, res) {
  var lexJWT = req.cookies.ls_token;

  if (!lexJWT) {
    res.send('Auth token required');
    return;
  }
  var verification = tokenService.verifyJWT(lexJWT);

  if (verification.name) {
    res.send(`failed token verification: ${verification}`);
    return;
  }

  var permissions = verification.body.data.permissions;

  if (permissions.includes('viewData')) {
    res.send('valuable notes etc');
  } else {
    res.send('Permission denied');
  }
});

app.get('/cookies', function(req, res) {
  res.send(req.cookies);
});

/**
 * Start the web server.
 */
var port = 3001;
app.listen(port, function () {
  console.log('Server listening on http://localhost:' + port);
});
