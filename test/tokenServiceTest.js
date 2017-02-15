var assert = require('assert');
var jwt = require('jsonwebtoken');
var fs = require('fs');

var TokenService = require('../src/TokenService');
var testObject = require('./testObjects');

var myPublicKey = fs.readFileSync('test/pubTest.pem');
var myPrivateKey = fs.readFileSync('test/privTest.pem');

var stormpathAccount = testObject.stormpathAccount
var tokenService, signedToken, decodedToken;

// Tests for the token service as a whole
describe('TokenService', function() {

  beforeEach(function() {
    tokenService = new TokenService(myPublicKey, myPrivateKey);
    signedToken = tokenService.createJWT(stormpathAccount);
    decodedToken = jwt.decode(signedToken, {complete: true});
  });

  describe('#createJWT(stormpathAccount)', function() {
    it('should create a signed JWT', function() {
      assert(decodedToken.header.typ == 'JWT');
      assert(decodedToken.signature);
    });

    it('should have several custom fields', function() {
      assert(decodedToken.header.kid,               'header.kid');
      assert(decodedToken.payload.iss == 'Emblem',  'iss is Emblem');
      assert(decodedToken.payload.iat,              'payload.iat');
      assert(decodedToken.payload.original_iat,     'payload.original_iat');
    });

    it('should have similar original_iat and iat', function() {
      var timeDiff = Math.abs(decodedToken.payload.original_iat - decodedToken.payload.iat);
      assert(timeDiff < 5, 'iat and original_iat are different!');
    });

    it('should have stormpath custom permission data', function() {
      var data = decodedToken.payload.body.data;
      assert(data.href);
      assert(data.createdAt);
      assert(data.modifiedAt);
    });
  });

  describe('#verifyJWT(signedToken)', function() {
    it('should verify a self signed token', function() {
      var verifyResult = tokenService.verifyJWT(signedToken);

      assert.deepEqual(verifyResult, decodedToken.payload);
    });

    // Super fragile test...should be easier
    it('should error if the token is expired', function() {
      var expiredToken = testObject.getExpiredSignedToken();
      var verifyResult = tokenService.verifyJWT(expiredToken);

      assert(verifyResult.name == 'TokenExpiredError');
    });

    it('should error if we don\'t trust the signing key', function() {
      var untrustedToken = testObject.signTokenWithKid('new-kid');
      var verifyResult = tokenService.verifyJWT(untrustedToken);

      assert(verifyResult.name == 'UnknownKeyError');
    });

    it('should verify if we trust the key first', function() {
      var trustedKey = tokenService.getKey('Emblem-key');
      tokenService.addTrustedKey('new-kid', trustedKey);

      var untrustedToken = testObject.signTokenWithKid('new-kid');
      var verifyResult = tokenService.verifyJWT(untrustedToken);

      assert(!verifyResult.name);
      assert(verifyResult.data);
    });

    it('should return a standard error', function() {
      var untrustedToken = testObject.signTokenWithKid('another-new-kid');
      var verifyResult = tokenService.verifyJWT(untrustedToken);

      assert(verifyResult.name == 'UnknownKeyError');
      assert(verifyResult.message);
      assert(verifyResult.kid == 'another-new-kid');
    });

  });

});
