
// Node and Gulp Modules
import cp from 'child_process';
import del from 'del';
import path from 'path';
import gulp from 'gulp';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';

// local files
import pkg from './package.json';
import config from './config.js';

// constants
const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// console messages
let messages = {
  jekyll: {
    development: 'Compiling Jekyll (Development)',
    production: 'Compiling Jekyll (Production)'
  }
};

/**
 * Gulp Tasks
 */

// Clean
gulp.task('clean', () => del(config.delete.src, {dot: true}));

/*
 * Generate CSS from Scss
 * Build sourcemaps
 * Minify CSS
 */
gulp.task('styles', () => {
  var sassConfig = config.sass.options;
  var filter = $.filter(['*.css', '!*.map']);

  browserSync.notify('Compiling Sass');

  return gulp.src(config.sass.src)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass(sassConfig).on('error', $.sass.logError))
    .pipe($.autoprefixer(config.autoprefixer))
    .pipe(filter) // don't write sourcemaps of sourcemaps
    .pipe($.sourcemaps.write('.', {includeContent: false}))
    .pipe(filter.restore()) // restore original files
    .pipe($.plumber.stop())
    .pipe(gulp.dest(config.sass.dest));
});

/*
 * Optimize Styles task
 */
gulp.task('optimize:styles', () => {
  return gulp.src(config.optimize.styles.src)
    .pipe($.csso(config.optimize.styles.options))
    .pipe(gulp.dest(config.optimize.styles.dest))
    .pipe($.size({title: 'styles'}));
});

/*
 * JSHint task
 */
gulp.task('jshint', () => {
  return gulp.src(config.scripts.src)
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter(config.jshint.reporter, config.jshint.options))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

/*
 * Scripts task
 * Run scripts through jshint
 */
gulp.task('scripts', () => {
  var removeVendor = $.filter(['*', '!/vendor']);
  var includeOnlyVendor = $.filter(['vendor/**/*.js']);

  return gulp.src(config.scripts.src)
    .pipe($.changed(config.scripts.dest))
    .pipe(removeVendor)
    .pipe($.concat('all.js'))
    .pipe(removeVendor.restore())
    .pipe(includeOnlyVendor)
    .pipe($.concat('vendor-all.js'))
    .pipe(includeOnlyVendor.restore())
    .pipe(gulp.dest(config.scripts.dest));
});

/*
 * Optimize Scripts task
 */
gulp.task('optimize:scripts', () => {
  var removeVendor = $.filter(['!vendor/']);
  var includeOnlyVendor = $.filter(['vendor/**/*.js']);

  return gulp.src(config.optimize.scripts.src)
    .pipe(removeVendor)
    .pipe($.uglify(config.optimize.scripts.options))
    .pipe($.concat('all.js'))
    .pipe(removeVendor.restore())
    .pipe(includeOnlyVendor)
    .pipe($.concat('vendor-all.js'))
    .pipe(includeOnlyVendor.restore())
    .pipe(gulp.dest(config.optimize.scripts.dest))
    .pipe($.size({title: 'scripts'}));
});

// Images
gulp.task('images', () => {
  return true;
});

/*
 * Optimize Images task
 */
gulp.task('optimize:images', () => {
  return gulp.src(config.optimize.images.src)
    .pipe($.imagemin(config.optimize.images.options))
    .pipe(gulp.dest(config.optimize.images.dest))
    .pipe($.size({title: 'images'}));
});

/*
 * Fonts task
 */
gulp.task('fonts', () => {
  return gulp.src(config.fonts.development.src)
    .pipe(gulp.dest(config.fonts.development.dest));
});

gulp.task('fonts:production', () => {
  return gulp.src(config.fonts.production.src)
    .pipe(gulp.dest(config.fonts.production.dest));
});

/*
 * Base64 encode smaller images
 */
gulp.task('base64', ['styles'], () => {
  return gulp.src(config.base64.src)
    .pipe($.base64(config.base64.options))
    .pipe(gulp.dest(config.base64.dest));
});

/*
 * Optimize HTML task
 */
gulp.task('optimize:html', () => {
  return gulp.src(config.optimize.html.src)
    .pipe($.htmlmin(config.optimize.html.options))
    .pipe(gulp.dest(config.optimize.html.dest))
    .pipe($.size({title: 'html'}));
});

/*
 * Copy extra files
 */
gulp.task('copy:extras:development', () => {
  return gulp.src(config.extras.development.src)
    .pipe(gulp.dest(config.extras.development.dest))
});

gulp.task('copy:extras:production', () => {
  return gulp.src(config.extras.production.src)
    .pipe(gulp.dest(config.extras.production.dest))
});

/*
 * Jekyll Development task
 */
gulp.task('jekyll', done => {
  var jekyllConfig = config.jekyll.development;

  browserSync.notify(messages.jekyll.development);

  return cp.spawn('bundle',
          [
            'exec', 'jekyll', 'build', '-q',
            '--source=' + jekyllConfig.src,
            '--destination=' + jekyllConfig.dest,
            '--config=' + jekyllConfig.config
          ],
          {stdio: 'inherit'}
        )
        .on('close', done);
});

/*
 * Jekyll Production task
 */
gulp.task('jekyll:production', done => {
  var jekyllConfig = config.jekyll.production;

  browserSync.notify(messages.jekyll.production);

  return cp.spawn('bundle',
          [
            'exec', 'jekyll', 'build', '-q',
            '--source=' + jekyllConfig.src,
            '--destination=' + jekyllConfig.dest,
            '--config=' + jekyllConfig.config
          ],
          {stdio: 'inherit'}
        )
        .on('close', done);
});

/*
 * Jekyll Rebuild task
 */
gulp.task('jekyll-rebuild', ['jekyll'], () => {
  reload();
})

/*
 * Build Development site
 */
gulp.task('build', ['clean'], done => {
  $.sequence(
    'jekyll',
    'styles',
    ['scripts', 'images', 'fonts', 'copy:extras:development'],
    'base64',
    done
  );
});

/*
 * Build Production site
 */
gulp.task('build:production', ['clean'], done => {
  $.sequence(
    'jekyll:production',
    'styles'
    ['scripts', 'images', 'fonts:production', 'copy:extras:production'],
    'base64',
    ['optimize:styles', 'optimize:scripts', 'optimize:images', 'optimize:html'],
    done
  );
});

/*
 * Run the build task and start a server with BrowserSync
 */
gulp.task('sync', ['build'], () => {
  browserSync(config.browserSync.development);
});

gulp.task('sync:production', ['build:production'], () => {
  browserSync(config.browserSync.production);
});

/*
 * Start BrowserSync and watch files for changes
 */
gulp.task('watch', ['sync'], () => {
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
gulp.task('deploy', ['sync:production'], () => {
  return gulp.src(config.jekyll.production.dest + '/**/*')
    .pipe($.ghPages(config.deploy));
});
