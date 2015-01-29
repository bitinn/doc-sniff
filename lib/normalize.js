
/**
 * normalize.js
 *
 * normalize a content-type header
 */

module.exports = normalize;

/**
 * Parse and normalize content-type
 *
 * @param   String  type  Content-type
 * @return  String
 */
function normalize(type) {
	if (!type) {
		return '';
	}

	// clean up content type (drop the parameters, such as charset)
	// ref: http://www.w3.org/Protocols/rfc1341/4_Content-Type.html
	if (type.indexOf(';') > 0) {
		type.split(';').some(function(part) {
			if (part.indexOf('/') > 0) {
				type = part;
				return true;
			}
			return false;
		});
	}

	return type.trim();
};
