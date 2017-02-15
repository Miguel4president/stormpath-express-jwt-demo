'use strict';

var express = require('express');
var stormpath = require('express-stormpath');
var cookieParser = require('cookie-parser');
var fs = require('fs');

var routes = require('./lib/routes');
var TokenService = require('./src/TokenService');


var myPublicKey = fs.readFileSync('config/public.pem');
var myPrivateKey = fs.readFileSync('config/privateKey.pem');

var tokenService = new TokenService(myPublicKey, myPrivateKey);

/**
 * Create the Express application.
 */
var app = express();

/**
 * Application settings.
 * - Aaron, Not sure I understand the difference between get/set - which seems like a hashmap
 *  and the locals paradigm, which seems like the same thing with a different accessor
 */
app.set('trust proxy',true); // Trust any number of proxies between client and this app? Is this needed
app.set('view engine', 'jade');
app.set('views', './lib/views');
app.locals.siteName = 'Express-Stormpath Example Project';
app.set('json spaces', 2);

/**
 * Stormpath initialization.
 */
 const postLogin = function (account, req, res, next) {
   console.log('This is nifty');
   next();
 };

console.log('Initializing Stormpath');
const stormpathSubApp = stormpath.init(app, {
  postLoginHandler: postLogin,
  expand: {
    customData: true
  },
  web: {
    // produces: ['application/json'],
    me: {
      expand: {
        customData: true
      }
    },
  },
  oauth2: {
    client_credentials: {
      accessToken: {
        ttl: 3600
      }
    }
  },
  debug: 'info'
  //logger: ourOwnWinstonLogger
});

app.use(cookieParser());
app.use(stormpathSubApp);

app.on('stormpath.ready',function () {
  console.log('Stormpath Ready');
});
/**
 * Route initialization.
 */
app.use('/', routes);


const getRoutes = function(expressRouteArray) {
  const simpleRoutes = expressRouteArray.map(function(route) {
    if (route.route) {
      return {route: route.route.path, method: Object.keys(route.route.methods)[0]};
    }
    return {route: false, method: false};
  });

  return simpleRoutes.filter(function(route) {
    return route.route;
  });
}

app.get('/routes', function(req, res) {
  let allRoutes = getRoutes(app._router.stack);
  allRoutes = allRoutes.concat(getRoutes(routes.stack));
  allRoutes = allRoutes.concat(getRoutes(stormpathSubApp.stack));
  res.json(allRoutes);
});

app.get('/newToken', stormpath.authenticationRequired, function(req, res) {
  console.log(req.cookies.access_token);

  var account = req.user;
  console.log('User:', account.email, 'just logged in!');
  var token = tokenService.createJWT(account);
  var verificationResult = tokenService.verifyJWT(token);

  res.cookie('ls_token', token);
  res.send(verificationResult);
});

app.get('/checkToken', stormpath.authenticationRequired, function(req, res) {
  var lexJWT = req.cookies.ls_token;
  console.log(lexJWT);

  if (!lexJWT) {
    res.send('No token found');
  }
  res.send(tokenService.verifyJWT(lexJWT));
});

app.get('/cookies', function(req, res) {
  res.send(req.cookies);
});

app.get('/keys', function(req, res) {
  res.json(myManager.kids);
});

/**
 * Start the web server.
 */
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Server listening on http://localhost:' + port);
});
