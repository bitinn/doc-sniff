
/**
 * index.js
 *
 * A helper for combating incorrect content-type
 */

module.exports = docsniff;

/*
General Note:
	whatwg spec has a much more thorough list for browser vendors
	on server-side, we are more interested in parsable documents
	if you encounter use-cases not covered by this, let us know on github issues
*/

/**
 * Simple mime sniffing
 * ref: https://mimesniff.spec.whatwg.org/#mime-type-sniffing-algorithm
 *
 * @param   String  type  Response content-type
 * @param   String  body  Response body
 * @return  String        Corrected MIME type
 */
function docsniff(type, body) {
	type = parseContentType(type);

	var str, res;

	// step 1
	if (!type) {
		str = responseHeader(body);

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
		str = responseHeader(body);

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

/**
 * Parse content-type
 *
 * @param   String  type  Content-type
 * @return  String
 */
function parseContentType(type) {
	// normalize content-type
	if (!type) {
		return '';
	}

	// clean up content type (drop the parameters, such as charset)
	// ref: http://www.w3.org/Protocols/rfc1341/4_Content-Type.html
	if (type.indexOf(';') > 0) {
		type.split(';').some(function(part) {
			if (part.indexOf('/') > 0) {
				type = part.trim();
				return true;
			}
			return false;
		});
	}

	return type;
};

/**
 * Response header
 *
 * @param   String  body  Response body
 * @return  String
 */
function responseHeader(body) {
	// by whatwg definition, should be the first 512 bytes of remote response
	// since we have the full body, just take 512 * 2 bytes from it instead
	var str = body.substr(0, 1024);

	// remove comments
	return str.replace(/<!--[\s\S]*?-->/g, '');
};

/**
 * html sniffing
 *
 * @param   String  str  Response header (as defined in whatwg)
 * @return  String
 */
function htmlSniff(str) {
	// case-insensitive match for HTML
	var matches = ['<!DOCTYPE HTML', '<HTML'];

	var found = matches.some(function(search) {
		var regex = new RegExp(search + '[\\s\\S]*?>', i);
		return regex.test(str));
	});

	if (found) {
		return 'text/html';
	}

	return '';
};

/**
 * xml sniffing
 *
 * @param   String  str  Response header (as defined in whatwg)
 * @return  String
 */
function xmlSniff(str) {
	// case-insensitive match for XML
	if (/<\?xml[\s\S]*?>/i.test(str)) {
		// rss
		if (/<\?rss[\s\S]*?>/i.test(str)) {
			return 'application/rss+xml';
		// atom
		} else if (/<\?feed[\s\S]*?>/i.test(str)) {
			return 'application/atom+xml';
		// rdf
		} else if (/<\?rdf:RDF[\s\S]*?>/i.test(str)) {
			return 'application/rdf+xml';
		}
		// default
		return 'text/xml';
	}

	return '';
};

/**
 * binary content sniffing
 *
 * @param   String  str  Response header (as defined in whatwg)
 * @return  String
 */
function binarySniff(str) {
	// detect binary strings
	var i, hex;
	while (i < str.length) {
		c = str.charCodeAt(i);
		if ((c >= 0 && c <= 8) || c === 11
			|| (c >= 14 && c <= 26) || (c >= 28 && c <= 31))
		{
			return 'application/octet-stream';
		}
	}

	return '';
};
