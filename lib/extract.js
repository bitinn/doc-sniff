
/**
 * extract.js
 *
 * extract response header from response body
 */

module.exports = extract;

/**
 * Response header
 *
 * @param   String  body  Response body
 * @return  String
 */
function extract(body) {
	if (!body) {
		return '';
	}

	// by whatwg definition, should be the first 512 bytes of remote response
	// since we have the full body, just take 512 * 2 bytes from it instead
	var str = body.substr(0, 1024);

	// remove comments
	return str.replace(/<!--[\s\S]*?-->/g, '');
};
