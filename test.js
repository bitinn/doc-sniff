
// test tools
var chai = require('chai');
var expect = chai.expect;

// test subjects
var docsniff = require('./index');
var xmlSniff = require('./lib/xml');
var htmlSniff = require('./lib/html');
var binarySniff = require('./lib/binary');
var extractBody = require('./lib/extract');
var normalizeHeader = require('./lib/normalize');
var type, body;

describe('doc-sniff', function() {

	describe('normalizeHeader', function() {
		it('should normalize empty content-type', function() {
			type = false;
			expect(normalizeHeader(type)).to.equal('');
		});

		it('should normalize content-type parameter', function() {
			type = 'text/html; charset=UTF-8';
			expect(normalizeHeader(type)).to.equal('text/html');
		});

		it('should normalize content-type whitespace', function() {
			type = '  text/html  ';
			expect(normalizeHeader(type)).to.equal('text/html');
		});

		it('should normalize incorrect content-type order', function() {
			// possibly a spec violation, but...
			type = 'charset=UTF-8; text/html';
			expect(normalizeHeader(type)).to.equal('text/html');
		});
	});

	describe('extractBody', function() {
		it('should extract first 1024 bytes from body', function() {
			body = Array(2000).join('a');
			expect(extractBody(body)).to.have.length(1024);
			expect(extractBody(body)).to.equal(Array(1025).join('a'));
		});

		it('should use the full body if shorter than 1024 bytes', function() {
			body = Array(201).join('a');
			expect(extractBody(body)).to.have.length(200);
			expect(extractBody(body)).to.equal(body);
		});

		it('should remove comment from body extraction', function() {
			body = '<!--comment-->test';
			expect(extractBody(body)).to.equal('test');
		});
	});

	describe('htmlSniff', function() {
		it('should detect html via doctype', function() {
			body = '<!DOCTYPE html>';
			expect(htmlSniff(body)).to.equal('text/html');
		});

		it('should detect html via html element', function() {
			body = '<html lang="en"></html>';
			expect(htmlSniff(body)).to.equal('text/html');
		});

		it('should return empty for anything else', function() {
			body = '<div>test</div>';
			expect(htmlSniff(body)).to.equal('');
		});
	});

	describe('xmlSniff', function() {
		it('should detect xml via dtd', function() {
			body = '<?xml version="1.0" encoding="UTF-8" ?>';
			expect(xmlSniff(body)).to.equal('text/xml');
		});

		it('should detect rss feed via rss element', function() {
			body = '<?xml version="1.0" encoding="UTF-8" ?><rss></rss>';
			expect(xmlSniff(body)).to.equal('application/rss+xml');
		});

		it('should detect atom feed via feed element', function() {
			body = '<?xml version="1.0" encoding="UTF-8" ?><feed></feed>';
			expect(xmlSniff(body)).to.equal('application/atom+xml');
		});

		it('should detect rdf feed via rdf:RDF element', function() {
			body = '<?xml version="1.0" encoding="UTF-8" ?><rdf:RDF></rdf:RDF>';
			expect(xmlSniff(body)).to.equal('application/rdf+xml');
		});

		it('should return empty for anything else', function() {
			body = '<html></html>';
			expect(xmlSniff(body)).to.equal('');
		});
	});

	describe('binarySniff', function() {
		it('should detect binary response, gif', function() {
			body = new Buffer('R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=', 'base64').toString();
			expect(binarySniff(body)).to.equal('application/octet-stream');
		});

		it('should detect binary response, png', function() {
			body = new Buffer('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQYV2P4DwABAQEAWk1v8QAAAABJRU5ErkJggg==', 'base64').toString();
			expect(binarySniff(body)).to.equal('application/octet-stream');
		});

		it('should detect binary response, jpg', function() {
			body = new Buffer('/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD//2Q==', 'base64').toString();
			expect(binarySniff(body)).to.equal('application/octet-stream');
		});
	});

	describe('docsniff', function() {
		it('should fallback to text/plain', function() {
			type = ''
			body = '';
			expect(docsniff(type, body)).to.equal('text/plain');

			type = false
			body = '';
			expect(docsniff(type, body)).to.equal('text/plain');

			type = ''
			body = false;
			expect(docsniff(type, body)).to.equal('text/plain');
		});

		it('should detect content-type when its missing', function() {
			type = false
			body = '<html></html>';
			expect(docsniff(type, body)).to.equal('text/html');

			body = '<?xml version="1.0" encoding="UTF-8" ?>';
			expect(docsniff(type, body)).to.equal('text/xml');

			body = new Buffer('R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=', 'base64').toString();
			expect(docsniff(type, body)).to.equal('application/octet-stream');

			body = 'test string';
			expect(docsniff(type, body)).to.equal('text/plain');
		});

		it('should trust content type if they are xml types', function() {
			type = 'text/xml';
			body = '<xml></xml>';
			expect(docsniff(type, body)).to.equal(type);

			type = 'application/xml';
			expect(docsniff(type, body)).to.equal(type);

			type = 'application/rss+xml';
			expect(docsniff(type, body)).to.equal(type);
		});

		it('should correct content type if xml are given text/html header', function() {
			type = 'text/html';
			body = '<?xml version="1.0" encoding="UTF-8" ?>';
			expect(docsniff(type, body)).to.equal('text/xml');

			body = '<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"></rss>';
			expect(docsniff(type, body)).to.equal('application/rss+xml');

			body = '<?xml version="1.0" encoding="UTF-8" ?><feed xmlns="http://www.w3.org/2005/Atom"></feed>';
			expect(docsniff(type, body)).to.equal('application/atom+xml');
		});

		it('should leave correct content type of html document alone', function() {
			type = 'text/html';
			body = '<html></html>';
			expect(docsniff(type, body)).to.equal(type);

			body = '<div>test string</div>';
			expect(docsniff(type, body)).to.equal(type);
		});

		it('should leave correct content type of xhtml document alone', function() {
			type = 'text/html';
			body = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html></html>';
			expect(docsniff(type, body)).to.equal('text/html');

			type = 'application/xhtml+xml';
			body = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html></html>';
			expect(docsniff(type, body)).to.equal('application/xhtml+xml');
		});

		it('should return original content-type if not supported', function() {
			type = 'application/font-ttf';
			body = '';
			expect(docsniff(type, body)).to.equal(type);

			type = 'image/png';
			expect(docsniff(type, body)).to.equal(type);

			type = 'video/mp4';
			expect(docsniff(type, body)).to.equal(type);
		});
	});

});
