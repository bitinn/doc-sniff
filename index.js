
/**
 * index.js
 *
 * A helper for combating incorrect content-type
 */

var xmlSniff = require('./lib/xml');
var htmlSniff = require('./lib/html');
var binarySniff = require('./lib/binary');
var extractBody = require('./lib/extract');
var normalizeHeader = require('./lib/normalize');

module.exports = docsniff;

/**
 * Simple mime sniffing
 * ref: https://mimesniff.spec.whatwg.org/#mime-type-sniffing-algorithm
 *
 * @param   String  type  Response content-type
 * @param   String  body  Response body
 * @return  String        Corrected MIME type
 */
function docsniff(type, body) {
	type = normalizeHeader(type);

	var str, res;

	// step 1
	if (!type) {
		str = extractBody(body);

		res = htmlSniff(str);
		if (res) {
			return res;
		}

		res = xmlSniff(str);
		if (res) {
			return res;
		}

		res = binarySniff(str);
		if (res) {
			return res;
		}

		// fallback
		return 'text/plain';

	// step 4
	} else if (type === 'application/xml' || type === 'text/xml'
			|| type.indexOf('+xml', type.length - 4) !== -1)
	{
		return type;

	// step 5
	} else if (type === 'text/html') {
		str = extractBody(body);

		res = xmlSniff(str);
		if (res) {
			return res;
		}

		// fallback
		return type;
	}

	// step 10
	return type;
};
