const autoprefixer = require('gulp-autoprefixer');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const livereload = require('gulp-livereload');
const nodemon = require('gulp-nodemon');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

var nodemonStream;

const lintFiles = ['app/**/*.js', '*.js'];
const buildFiles = ['babel-polyfill', 'app/js/entry.js'];
const webpackOptions = {
  output: {
    filename: 'main.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          __dirname + '/app/js'
        ],
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};

gulp.task('lint', () => {
  return gulp.src(lintFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('static:dev', () => {
  return gulp.src('app/index.html')
    .pipe(gulp.dest('build'))
    .pipe(livereload());
});

gulp.task('css:dev', () => {
  return gulp.src('app/css/main.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('build'))
    .pipe(livereload());
});

gulp.task('webpack:dev', () => {
  return gulp.src(buildFiles)
    .pipe(webpackStream(webpackOptions, webpack))
    .pipe(gulp.dest('build'))
    .pipe(livereload());
});

gulp.task('static:pro', () => {
  return gulp.src('app/index.html')
    .pipe(gulp.dest('build'));
});

gulp.task('css:pro', () => {
  return gulp.src('app/css/main.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('webpack:pro', () => {
  return gulp.src(buildFiles)
    .pipe(webpackStream(webpackOptions, webpack))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', ['build:dev'], () => {
  if (nodemonStream) {
    nodemonStream.emit('restart');
  } else {
    nodemonStream = nodemon({
      script: 'server.js',
      watch: ['server.js']
    })
    .on('restart', () => {
      process.stdout.write('Server restarted!\n');
    })
    .on('crash', () => {
      process.stderr.write('Server crashed!\n');
    });
  }

  livereload.listen();
  gulp.watch('app/index.html', ['static:dev']);
  gulp.watch('app/css/main.css', ['css:dev']);
  gulp.watch('app/**/*.js', ['webpack:dev']);
  gulp.watch('gulpfile.js', ['watch']);
});

gulp.task('build:dev', ['webpack:dev', 'css:dev', 'static:dev']);
gulp.task('build:pro', ['webpack:pro', 'css:pro', 'static:pro']);
gulp.task('default', ['lint']);
