var src = 'app';
var build = 'build';
var development = 'build/development';
var production = 'build/production';
var srcAssets = 'app/_assets';
var developmentAssets = 'build/assets';
var productionAssets = 'build/production/assets';

module.exports = {
  browserSync: {
    development: {
      server: {
        baseDir: [development, build, src]
      },
      port: 9999,
      files: [
        developmentAssets + '/css/*.css',
        developmentAssets + '/js/*.js',
        developmentAssets + '/images/**'
      ]
    },
    production: {
      server: {
        baseDir: [production]
      },
      port: 9998
    }
  },
  delete: {
    src: [developmentAssets, './.publish']
  },
  jshint: {
    reporter: 'default',
    options: {
      verbose: true
    }
  },
  jekyll: {
    development: {
      src: src,
      dest: development,
      config: '_config.yml'
    },
    production: {
      src: src,
      dest: production,
      config: '_config.yml,_config.build.yml'
    }
  },
  fonts: {
    development: {
      src: srcAssets + '/fonts/**/*.{ttf,woff,woff2}',
      dest: developmentAssets + '/fonts'
    },
    production: {
      src: srcAssets + '/fonts/**/*.{css,ttf,woff,woff2}',
      dest: productionAssets + '/fonts'
    }
  },
  extras: {
    development: {
      src: ['/CNAME', '/README.md', '/favicon.ico'],
      dest: development
    },
    production: {
      src: ['/CNAME', '/README.md', '/favicon.ico', '/.travis.yml'],
      dest: production
    }
  },
  sass: {
    src: srcAssets + '/styles/**/*.{sass,scss}',
    dest: developmentAssets + '/css',
    options: {}
  },
  scripts: {
    src: srcAssets + '/scripts/**/*.js',
    dest: developmentAssets + '/js',
    options: {}
  },
  autoprefixer: {
    browsers: [
      'last 2 version',
      'safari 5',
      'ie 8',
      'ie 9',
      'opera 12.1',
      'ios 6',
      'android 4'
    ],
    cascade: true
  },
  base64: {
    src: developmentAssets + '/css/*.css',
    dest: developmentAssets + '/css',
    options: {
      baseDir: build,
      extensions: ['png'],
      maxImageSize: 20 * 1024, // bytes
      debug: false
    }
  },
  watch: {
    jekyll: [
      '_config.yml',
      '_config.build.yml',
      src + '/_data/**/*.{json,yml,csv}',
      src + '/_includes/**/*.{html,xml}',
      src + '/_layouts/*.html',
      src + '/_plugins/*.rb',
      src + '/_posts/*.{markdown,md}',
      src + '/**/*.{html,markdown,md,yml,json,txt,xml}',
      src + '/*'
    ],
    sass: srcAssets + '/styles/**/*.{sass,scss}',
    scripts: srcAssets + '/scripts/**/*.js',
    images: srcAssets + '/images/**/*',
    svg: srcAssets + '/vectors/*.svg'
  },
  optimize: {
    html: {
      src: production + '/**/*.html',
      dest: production,
      options: {
        collapseWhitespace: true
      }
    },
    styles: {
      src: developmentAssets + '/css/*.css',
      dest: productionAssets + '/css/',
      options: {}
    },
    scripts: {
      src: developmentAssets + '/js/**/*.js',
      dest: productionAssets + '/js',
      options: {}
    },
    images: {
      src: developmentAssets + '/images/**/*.{jpg,jpeg,png,gif}',
      dest: productionAssets + '/images/',
      options: {
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
      }
    }
  },
  deploy: {
    branch: 'master',
    push: true
  }
};