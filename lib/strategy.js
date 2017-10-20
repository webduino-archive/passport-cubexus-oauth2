var util = require('util')
	  request = require('request'),
    OAuth2Strategy = require('passport-oauth2');

function Strategy(options, verify) {
	options = options || {};
	options.authorizationURL = options.authorizationURL || 'https://id.webduino.io/oauth/authorize';
	options.tokenURL = options.tokenURL || 'https://id.webduino.io/oauth/token';

	OAuth2Strategy.call(this, options, verify);
	this.name = 'webduino';
	this._userProfileURL = options.userProfileURL || 'https://id.webduino.io/profile';
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function(accessToken, done) {
	var options = {
		method: 'GET',
		url: 'https://api-staging.cubexus.com/api/v1/users/me',
		headers: {
			authorization: 'Bearer '+accessToken
		}
	};

	request(options, function(error, response, body) {
	  if (error) throw new Error(error);

		var json;
		try {
			json = JSON.parse(body);
		} catch (ex) {
			return done(new Error('Failed to parse user profile'));
		}
		json.username = json.name;
		json.emails = [{"value":json.email.replace(/\s/g,"")}];
		json.provider = 'cubexus';
		json._raw = body;
		done(null, json);
	});
}

module.exports = Strategy;
