var fs = require('fs');
var jwt = require('jsonwebtoken');

var stormpathAccount = {
  href: 'https://api.stormpath.com/v1/accounts/2dx9IKnW9QDLMblCt9t2Ka',
  username: 'adawg',
  email: 'avotre@lexington-solutions.com',
  givenName: 'Aaron',
  middleName: '',
  surname: 'Votre',
  fullName: 'Aaron Votre',
  status: 'ENABLED',
  createdAt: '2017-02-09T23:56:14.202Z',
  modifiedAt: '2017-02-09T23:56:14.202Z',
  passwordModifiedAt: '2017-02-09T23:56:14.000Z',
  emailVerificationStatus: 'UNVERIFIED',
  emailVerificationToken: null,
  customData: {
   CustomData: {
     href: 'https://api.stormpath.com/v1/accounts/2dx9IKnW9QDLMblCt9t2Ka/customData',
     createdAt: '2017-02-09T23:56:14.202Z',
     modifiedAt: '2017-02-09T23:57:57.221Z',
     birthday: 'free text lol',
     favoriteColor: 'Black'
   }
 },
  providerData: { href: 'https://api.stormpath.com/v1/accounts/2dx9IKnW9QDLMblCt9t2Ka/providerData' },
  directory: { href: 'https://api.stormpath.com/v1/directories/TRhZpuwVViWYq2PtcOINI' },
  tenant: { href: 'https://api.stormpath.com/v1/tenants/Qj5VBTqKnKXf6OXUFQBH2' },
  groups: { href: 'https://api.stormpath.com/v1/accounts/2dx9IKnW9QDLMblCt9t2Ka/groups' },
  applications: { href: 'https://api.stormpath.com/v1/accounts/2dx9IKnW9QDLMblCt9t2Ka/applications' },
  groupMemberships: { href: 'https://api.stormpath.com/v1/accounts/2dx9IKnW9QDLMblCt9t2Ka/groupMemberships' },
  apiKeys: { href: 'https://api.stormpath.com/v1/accounts/2dx9IKnW9QDLMblCt9t2Ka/apiKeys' },
  accessTokens: { href: 'https://api.stormpath.com/v1/accounts/2dx9IKnW9QDLMblCt9t2Ka/accessTokens' },
  refreshTokens: { href: 'https://api.stormpath.com/v1/accounts/2dx9IKnW9QDLMblCt9t2Ka/refreshTokens' },
  linkedAccounts: { href: 'https://api.stormpath.com/v1/accounts/2dx9IKnW9QDLMblCt9t2Ka/linkedAccounts' },
  accountLinks: { href: 'https://api.stormpath.com/v1/accounts/2dx9IKnW9QDLMblCt9t2Ka/accountLinks' },
  phones: { href: 'https://api.stormpath.com/v1/accounts/2dx9IKnW9QDLMblCt9t2Ka/phones' },
  factors: { href: 'https://api.stormpath.com/v1/accounts/2dx9IKnW9QDLMblCt9t2Ka/factors' }
};

// Proffessional error from jwt library
var expiredError = {
  TokenExpiredError: '...actual error here',
  name: 'TokenExpiredError',
  message: 'jwt expired',
  expiredAt: '2017-02-12T20:27:07.000Z'
};

var getExpiredSignedToken = function() {
  return jwt.sign(
    { data: 'expired token', exp: Math.round(Date.now()/1000) - 10 },
    fs.readFileSync('test/privTest.pem'),
    { algorithm: 'HS256', header: { kid: 'Emblem-key'} });
};

var signTokenWithKid = function(kid) {
  return jwt.sign(
    { data: 'token with different kid' },
    fs.readFileSync('test/privTest.pem'),
    { algorithm: 'HS256', header: { kid: kid} });
};

module.exports.getExpiredSignedToken = getExpiredSignedToken;
module.exports.stormpathAccount = stormpathAccount;
module.exports.signTokenWithKid = signTokenWithKid;
