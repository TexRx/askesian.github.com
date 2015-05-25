'use strict';

/**
 * Node and Gulp Modules
 */
var cp = require('child_process');
var del = require('del');
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
  jekyll: {
    development: 'Compiling Jekyll (Development)',
    production: 'Compiling Jekyll (Production)'
  }
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
    .pipe($.sourcemaps.init())
    .pipe($.sass(sassConfig))
    .pipe($.autoprefixer(config.autoprefixer))
    .pipe(filter) // don't write sourcemaps of sourcemaps
    .pipe($.sourcemaps.write('.', { includeContent: false }))
    .pipe(filter.restore()) // restore original files
    .pipe(gulp.dest(config.sass.dest));
});

/*
 * Optimize Styles task
 */
gulp.task('optimize:styles', function () {
  return gulp.src(config.optimize.styles.src)
    .pipe($.csso(config.optimize.styles.options))
    .pipe(gulp.dest(config.optimize.styles.dest))
    .pipe($.size());
});

/*
 * Scripts task
 * Run scripts through jshint
 */
gulp.task('scripts', function () {
  return gulp.src(config.scripts.src)
    .pipe($.jshint())
    .pipe(gulp.dest(config.scripts.dest));
});

/*
 * Optimize Scripts task
 */
gulp.task('optimize:scripts', function () {
  return gulp.src(config.optimize.scripts.src)
    .pipe($.uglify(config.optimize.scripts.options))
    .pipe($.concat('all.js'))
    .pipe(gulp.dest(config.optimize.scripts.dest))
    .pipe($.size());
});

// Images
gulp.task('images', function () {
  return true;
});

/*
 * Optimize Images task
 */
gulp.task('optimize:images', function () {
  return gulp.src(config.optimize.images.src)
    .pipe($.imagemin(config.optimize.images.options))
    .pipe(gulp.dest(config.optimize.images.dest))
    .pipe($.size());
});

/*
 * Base64 encode smaller images
 */
gulp.task('base64', ['styles'], function () {
  return gulp.src(config.base64.src)
    .pipe($.base64(config.base64.options))
    .pipe(gulp.dest(config.base64.dest));
});

/*
 * Optimize HTML task
 */
gulp.task('optimize:html', function () {
  return gulp.src(config.optimize.html.src)
    .pipe($.htmlmin(config.optimize.html.options))
    .pipe(gulp.dest(config.optimize.html.dest));
});

/*
 * Jekyll Development task
 */
gulp.task('jekyll', function (done) {
  var jekyllConfig = config.jekyll.development;

  browserSync.notify(messages.jekyll.development);

  return cp.spawn('bundle',
          [
            'exec', 'jekyll', 'build', '-q',
            '--source=' + jekyllConfig.src,
            '--destination=' + jekyllConfig.dest,
            '--config=' + jekyllConfig.config
          ],
          { stdio: 'inherit' }
        )
        .on('close', done);
});

/*
 * Jekyll Production task
 */
gulp.task('jekyll:production', function (done) {
  var jekyllConfig = config.jekyll.production;

  browserSync.notify(messages.jekyll.production);

  return cp.spawn('bundle',
          [
            'exec', 'jekyll', 'build', '-q',
            '--source=' + jekyllConfig.src,
            '--destination=' + jekyllConfig.dest,
            '--config=' + jekyllConfig.config
          ],
          { stdio: 'inherit' }
        )
        .on('close', done);
});

/*
 * Jekyll Rebuild task
 */
gulp.task('jekyll-rebuild', ['jekyll'], function () {
  reload();
})

/*
 * Build Development site
 */
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
 * Build Production site
 */
gulp.task('build:production', function (done) {
  $.sequence('delete', 'jekyll:production',
    [
      'styles',
      'scripts',
      'images'
    ],
    'base64',
    [
      'optimize:styles',
      'optimize:scripts',
      'optimize:images',
      'optimize:html'
    ],
    done);
});

/*
 * Run the build task and start a server with BrowserSync
 */
gulp.task('sync', ['build'], function () {
  browserSync(config.browserSync.development);
});

gulp.task('sync:production', ['build:production'], function () {
  browserSync(config.browserSync.production);
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

/*
 * Default task
 */
gulp.task('default', ['watch']);

/*
 * Deploy site to github
 */
gulp.task('deploy', ['sync:production'], function () {
  return gulp.src(config.jekyll.production.dest + '/**/*')
    .pipe($.ghPages(config.deploy));
});
