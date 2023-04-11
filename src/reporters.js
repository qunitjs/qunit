import ConsoleReporter from './reporters/ConsoleReporter.js';
import PerfReporter from './reporters/PerfReporter.js';
import TapReporter from './reporters/TapReporter.js';

export default {
  console: ConsoleReporter,
  perf: PerfReporter,
  tap: TapReporter
};
