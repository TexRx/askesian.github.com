---
title: Exclusion filter gotcha with gulp-filter
layout: post
---

When using [gulp-filter](https://www.npmjs.com/package/gulp-filter), you  might run into an issue when using an exclusion filter to remove certain files or directories from the source files passed to `gulp.src(...)`.

To illustrate, imagine a gulp task like the following:

```javascript
gulp.task('js', function() {
  var filterVendorJs = $.filter(['!vendor']);

  gulp.src(config.scripts.src)
    .pipe(filterVendorJs)
    .pipe($.concat('all.js'))
    .pipe(filterVendorJs.restore())
    .pipe(gulp.dest(config.scripts.dest));
});
```

Now, you run your gulp tasks, of which this `js` task is a part, and you find that there is no `all.js` file in your destination directory. You poke around for a bit, maybe even resort to inspecting the `gulp-filter` source, but you're still stumped. Then you try the following:


```javascript
gulp.task('js', function() {
  var filterVendorJs = $.filter(['*', '!vendor']);

  gulp.src(config.scripts.src)
    .pipe(filterVendorJs)
    .pipe($.concat('all.js'))
    .pipe(filterVendorJs.restore())
    .pipe(gulp.dest(config.scripts.dest));
});
```

And, you find that it now works as expected. Apparently, due to a change in [multimatch](https://github.com/sindresorhus/multimatch/releases/tag/v0.3.0), whenever you use an exclusion filter with `gulp-filter`, you must first specify an inclusion filter -- relative to the source files passed to `gulp.src()`, and the easiest way to achieve this is to simply pass in `*`.

I hope this saves you from head-in-hands exasperation.