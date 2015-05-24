'use strict';

/**
 * Node and Gulp Modules
 */
var cp = require('child_process');
var del = require('del');
var htmlmin = require('htmlmin');
var path = require('path');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

/**
 * Local Files
 */
var pkg = require('./package.json');
var config = require('./config.js');

console.log(config);

var messages = {
  jekyll: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Gulp Tasks
 */

// Delete
gulp.task('delete', function (done) {
  del(config.delete.src, done);
});

/*
 * Generate CSS from Scss
 * Build sourcemaps
 * Minify CSS
 */
gulp.task('styles', function () {
  var sassConfig = config.sass.options;
  var filter = $.filter(['*.css','!*.map']);

  browserSync.notify('Compiling Sass');

  return gulp.src(config.sass.src)
    .pipe($.plumber())
    .pipe($.sass(sassConfig))
    .pipe($.sourcemaps.init())
    .pipe($.autoprefixer(config.autoprefixer))
    .pipe(filter) // don't write sourcemaps of sourcemaps
    .pipe($.csso())
    .pipe($.sourcemaps.write('.', { includeContent: false }))
    .pipe(filter.restore()) // restore original files
    .pipe(gulp.dest(config.sass.dest));
});

// Scripts
gulp.task('scripts', function () {
  return true;
});

// Images
gulp.task('images', function () {
  return true;
});

/*
 * Base64 encode smaller images
 */
gulp.task('base64', ['styles'], function () {
  return gulp.src(config.base64.src)
    .pipe($.base64(config.base64.options))
    .pipe(gulp.dest(config.base64.dest));
});

// HTML
gulp.task('html', ['jekyll'], function () {
  return gulp.src(path.join(config.paths.deploy, '/**/*.html'))
    .pipe($.htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(config.paths.deploy))
    .pipe(reload({ stream: true, once: true }));
});

// Jekyll
gulp.task('jekyll', function (done) {
  var jekyllConfig = config.jekyll.development;

  browserSync.notify(messages.jekyll);

  return cp.spawn('bundle',
          [
            'exec',
            'jekyll',
            'build',
            '-q',
            '--source=' + jekyllConfig.src,
            '--destination=' + jekyllConfig.dest,
            '--config=' + jekyllConfig.config
          ],
          { stdio: 'inherit' }
        )
        .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll'], function () {
  reload();
})

/*
 * Run the build task and start a server with BrowserSync
 */
gulp.task('sync', ['build'], function () {
  browserSync(config.browserSync.development);
});

// Build
gulp.task('build', function (done) {
  $.sequence('delete',
    [
      'jekyll',
      'styles',
      'scripts',
      'images'
    ],
    'base64',
    done);
});

/*
 * Start BrowserSync and watch files for changes
 */
gulp.task('watch', ['sync'], function () {
  gulp.watch(config.watch.jekyll, ['jekyll-rebuild']);
  gulp.watch(config.watch.sass, ['styles']);
  gulp.watch(config.watch.scripts, ['scripts']);
  gulp.watch(config.watch.images, ['images']);
});

// Default
gulp.task('default', ['watch']);

// Deploy
gulp.task('deploy', function () {
  return gulp.src('./build/**/*')
    .pipe($.deploy());
});
