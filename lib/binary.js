
/**
 * binary.js
 *
 * detect binary response
 */

module.exports = binary;

/**
 * binary content sniffing
 *
 * @param   String  str  Response header (as defined in whatwg)
 * @return  String
 */
function binary(str) {
	// detect binary strings
	var i = 0;
	var c;
	while (i < str.length) {
		c = str.charCodeAt(i);
		if ((c >= 0 && c <= 8) || c === 11
			|| (c >= 14 && c <= 26) || (c >= 28 && c <= 31))
		{
			return 'application/octet-stream';
		}
		i++;
	}

	return '';
};
