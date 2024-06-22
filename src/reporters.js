import ConsoleReporter from './reporters/ConsoleReporter.js';
import PerfReporter from './reporters/PerfReporter.js';
import TapReporter from './reporters/TapReporter.js';
import HtmlReporter from './html-reporter/html';

export default {
  console: ConsoleReporter,
  perf: PerfReporter,
  tap: TapReporter,
  html: HtmlReporter
};
