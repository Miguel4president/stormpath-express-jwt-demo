var jwt = require('jsonwebtoken');

/**
 * TokenService is meant to simplify our token auth. It will read some config
 * (Currently hardcoded) and perform the standard LS JWT proceedure and guarentee
 * token structure between services. This is meant to be used in all the services.
 *
 * A note on algorithms
 * HS256 - symmetric, only 1 key and it's needed to create and verify
 *  We could do this and put the keys in each apps config
 * RS256 - asymmetric, pub and private. I think this would be better of us.
 *  We can do this and allow apps to get the public keys of other services.
*/
class TokenService {
  constructor(publicKey, privateKey) {
    // This stuff should come from a config file
    // this._publicKey = fs.readFileSync('../config/public.pem');
    // this._privateKey = fs.readFileSync('../config/privateKey.pem');
    this._publicKey = publicKey;
    this._privateKey = privateKey;
    this._hsKey = privateKey;
    this._algorithm = 'HS256';
    this._issuer = 'Emblem';
    this._kid = 'Emblem-key';
    this._trustedKeys = new Map();
    this._refreshWindow = 24 * 60 * 60; // one day worth of seconds
    this._expirationWindow = 15 * 60; // 15 minutes worth of seconds

    this.addTrustedKey(this._kid, this._hsKey);

    this._createOptions = {
      issuer: this._issuer,
      algorithm: this._algorithm,
      expiresIn: this._expirationWindow,
      header: {
        kid: this._kid,
      }
    };
  }

  get issuer() {
    return this._issuer;
  }

  get algorithm() {
    return this._algorithm;
  }

  get kid() {
    return this._kid;
  }

  get publicKey() {
    return this._publicKey;
  }

  get trustedKeys() {
    return this._trustedKeys;
  }

  get keys() {
    return this._trustedKeys.values();
  }

  get kids() {
    return this._trustedKeys.keys();
  }

  getKey(kid) {
    return this._trustedKeys.get(kid);
  }

  addTrustedKey(kid, key) {
    this._trustedKeys.set(kid, key);
  }

  createJWT(stormpathAccount) {
    var payload = {
      body: {
        user: stormpathAccount.username,
        userId: stormpathAccount.href,
        data: stormpathAccount.customData.CustomData,
        tenantName: 'tenantName',
        tenantId: 'tenantId'
      },
      original_iat: Math.round(Date.now() / 1000)
    };

    return jwt.sign(payload, this._privateKey, this._createOptions);
  }

  // We won't need this I don't think.
  // Stormpath will give us an oauth token, if that is working
  // then we just request a new JWT
  refreshJWT(token) {
    var verificationResult = this.verifyJWT(token);
    if (verificationResult.name) {
      // We failed the validation and should do something
      return 'Error';
    }

    // if more than refresh window, force login
    if (new Date().now - verificationResult.original_iat > this._refreshWindow) { // iat == issued at
      // return res.send(401); // re-logging
      return 'Error - Need to re-login';
    }

    // Next message Stormpath to verify that the user is good.

    // Create a new token, except use the original_iat from this one.
    // console.log('Token\'s valid, creating a new one.');
    return jwt.sign(verificationResult, this._privateKey);
  }

  /**
   * Returns the decoded JWT ONLY if the signature matches the key we have.
   * If not, we return the error.
   */
  verifyJWT(token) {
    let result = {};

    var header = this.getDecodedHeader(token);
    var alg = header.alg;
    var signatureKey = this._trustedKeys.get(header.kid);

    if (!signatureKey) return this.createUnknownKeyError(header.kid);

    try {
        result = jwt.verify(token, signatureKey, { algorithms: [this._algorithm] });
    } catch(error) {
        result = error;
    }

    return result;
  }

  /**
  * Decodes the token to get the kid and hash algorithm.
  * returns the decoded header info.
  */
  getDecodedHeader(token) {
    // console.log('Decoding token to get signature verification info...');
    var decoded = jwt.decode(token, {complete: true});
    // console.log('Decoded Header: ', decoded.header);
    return decoded.header;
  }

  createUnknownKeyError(kid) {
    return {
      UnknownKeyError: 'content',
      name: 'UnknownKeyError',
      message: 'signing key is unknown',
      kid: kid
    };
  }

};


module.exports = TokenService;
