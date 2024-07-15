import ConsoleReporter from './reporters/ConsoleReporter.js';
import PerfReporter from './reporters/PerfReporter.js';
import TapReporter from './reporters/TapReporter.js';
import HtmlReporter from './reporters/HtmlReporter.js';

export default {
  console: ConsoleReporter,
  perf: PerfReporter,
  tap: TapReporter,
  html: HtmlReporter
};
