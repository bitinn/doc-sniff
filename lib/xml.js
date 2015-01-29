
/**
 * xml.js
 *
 * detect xml document
 */

module.exports = xml;

/**
 * xml sniffing
 *
 * @param   String  str  Response header (as defined in whatwg)
 * @return  String
 */
function xml(str) {
	// case-insensitive match for XML
	if (/<\?xml[\s\S]*?>/i.test(str)) {
		// rss
		if (/<rss[\s\S]*?>/i.test(str)) {
			return 'application/rss+xml';
		// atom
		} else if (/<feed[\s\S]*?>/i.test(str)) {
			return 'application/atom+xml';
		// rdf
		} else if (/<rdf:RDF[\s\S]*?>/i.test(str)) {
			return 'application/rdf+xml';
		}
		// default
		return 'text/xml';
	}

	return '';
};
