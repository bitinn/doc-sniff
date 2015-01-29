
/**
 * html.js
 *
 * detect html document
 */

module.exports = html;

/**
 * html sniffing
 *
 * @param   String  str  Response header (as defined in whatwg)
 * @return  String
 */
function html(str) {
	// case-insensitive match for HTML
	var matches = ['<!DOCTYPE HTML', '<HTML'];

	var found = matches.some(function(search) {
		var regex = new RegExp(search + '[\\s\\S]*?>', 'i');
		return regex.test(str);
	});

	if (found) {
		return 'text/html';
	}

	return '';
};
