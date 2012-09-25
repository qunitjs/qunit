/**
 * QUnit Test Suite for Google Apps Script
 *
 * Read the <a href="https://github.com/simula-innovation/qunit/tree/gas/gas">README</a> for more information.
 */

QUnit.helpers( this );
QUnit.exposeInternals(); // Use only when testing QUnit itself.

function tests() {
  console = Logger;
  logsTest();
  qunitTest();
  deepEqualTest();
}

function doGet( e ) {
  QUnit.urlParams( e.parameter );
  QUnit.config({
    //cssUrl: "https://raw.github.com/jquery/qunit/master/addons/themes/nv.css", // Chooses a style sheet available on the web
    //hidepassed: true, // Hides passed tests.
    //reverse: true, // Prints tests in reverse order.
    title: "QUnit for Google Apps Script - Test suite" // Sets the title of the test page.
  });
  QUnit.load( tests );
  // Uncomment the following line if you want to debug the generated HTML source in the Caja Playground (http://caja.appspot.com)
  //return ContentService.createTextOutput().setContent(QUnit.getHtml().getContent());
  return QUnit.getHtml();
};
