import QUnit from "core";
import diff from "../external/jsdiff/jsdiff";
import dump from "dump";
import equiv from "equiv";
import { begin, done, testStart, testDone, log } from "../reporter/html";

QUnit.equiv = equiv;
QUnit.diff = diff;
QUnit.dump = dump;

// back compat
QUnit.jsDump = dump;

QUnit.begin( begin );
QUnit.done( done );
QUnit.testStart( testStart );
QUnit.log( log );
QUnit.testDone( testDone );

export default QUnit;
