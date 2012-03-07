/*global config:true, task:true*/
config.init({
  pkg: '<json:package.json>',
  meta: {
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= template.today("m/d/yyyy") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
      '* Copyright (c) <%= template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
  },
  qunit: {
    // TODO include 'test/logs.html' as well
    files: ['test/index.html']
  },
  lint: {
    // TODO lint test files: 'test/**/*.js' - needs seperate globals list
    files: ['grunt.js', 'qunit/*.js']
  },
  jshint: {
    options: {
      bitwise: true,
      curly: true,
      trailing: true,
      immed: true,
      latedef: false,
      newcap: true,
      noarg: false,
      noempty: true,
      nonew: true,
      sub: true,
      undef: true,
      eqnull: true,
      browser: true,
      proto: true
    },
    globals: {
      jQuery: true,
      exports: true
    }
  }
});

// Default task.
task.registerTask('default', 'lint qunit');
