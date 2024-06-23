import QUnit from './core';
import { initBrowser } from './browser/browser-runner';
import { window, document } from './globals';

if (window && document) {
  initBrowser(QUnit, window, document);
}
