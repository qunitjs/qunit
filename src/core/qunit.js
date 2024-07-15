import QUnit from './core.js';
import { initBrowser } from './browser/browser-runner.js';
import { window, document } from './globals.js';
import exportQUnit from './export.js';

exportQUnit(QUnit);

if (window && document) {
  initBrowser(QUnit, window, document);
}
