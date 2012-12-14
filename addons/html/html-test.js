/*global QUnit:false, module:false, test:false */

module('qunit-html addon tests');

test('Equivalent HTML - Equivalent without normalization', function() {
	QUnit.htmlEqual('test', 'test');
	QUnit.htmlEqual('<b>test</b>', '<b>test</b>');
	QUnit.htmlEqual('<br/>', '<br/>');
});

test('Equivalent HTML - Equivalent after trimming whitespace', function() {
	QUnit.htmlEqual('test', '  test');
	QUnit.htmlEqual('test', '\ttest');
	QUnit.htmlEqual('test', '\ntest');
	QUnit.htmlEqual('test', 'test  ');
	QUnit.htmlEqual('test', 'test\t');
	QUnit.htmlEqual('test', 'test\n');
	QUnit.htmlEqual('<b>test</b>', '  <b>test</b>');
	QUnit.htmlEqual('<b>test</b>', '\t<b>test</b>');
	QUnit.htmlEqual('<b>test</b>', '\n<b>test</b>');
	QUnit.htmlEqual('<b>test</b>', '<b>test</b>  ');
	QUnit.htmlEqual('<b>test</b>', '<b>test</b>\t');
	QUnit.htmlEqual('<b>test</b>', '<b>test</b>\n');
});

test('Equivalent HTML - IE element tag name uppercasing', function() {
	QUnit.htmlEqual('<B>test</B>', '<b>test</b>');
});

test('Equivalent HTML - IE attribute name uppercasing', function() {
	QUnit.htmlEqual('<B TITLE="test">test</B>', '<b title="test">test</b>');
});

test('Equivalent HTML - IE attribute optimization drops "unnecessary" quotes', function() {
	QUnit.htmlEqual('<b title=test>test</b>', '<b title="test">test</b>');
});

test('Equivalent HTML - Singleton/empty elements', function() {
	QUnit.htmlEqual('<br/>', '<br />');
	QUnit.htmlEqual('<br>', '<br />');
});

test('Equivalent HTML - Possible attribute reordering', function() {
	QUnit.htmlEqual(
		'<b id="id" class="className" title="test" lang="en">test</b>',
		'<b class="className" id="id" lang="en" title="test">test</b>'
	);
	
	// From: http://stackoverflow.com/questions/9227517/firefox-tag-attributes-badly-reordered-after-html-parse
	QUnit.htmlEqual(
		'<input id="id" type="text" value="blah" size="5">',
		'<input id="id" type="text" size="5" value="blah">'
	);
	
	QUnit.htmlEqual(
		'<input id="id" type="text" value="blah" size="5" />',
		'<input id="id" type="text" size="5" value="blah" />'
	);
});

test('Unequivalent HTML', function() {
	QUnit.notHtmlEqual('test fail', 'TEST FAIL', 'Text node value casing differences cause inequality');
	QUnit.notHtmlEqual('test fail', '<b>test fail</b>', 'Different DOM structure causes inequality');
	QUnit.notHtmlEqual('<b>test fail</b>', '<i>test fail</i>', 'Same DOM structure but different elements causes inequality');
	QUnit.notHtmlEqual('<b>test fail</b>', '<b>test <i>fail</i></b>', 'Extra internal element wrappers cause inequality');
	QUnit.notHtmlEqual('<b title="TEST">test</b>', '<b title="test">test</b>', 'Attribute value casing differences cause inequality');
	QUnit.notHtmlEqual('<b id="actual">test fail</b>', '<b id="expected">test fail</b>', 'Attribute value differences cause inequality');
});
