QUnit.config.autostart = false;

Promise.all([
  import('./foo.js'),
  import('./bar.js')
]).then(function () {
  QUnit.start();
});
