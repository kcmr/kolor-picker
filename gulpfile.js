'use strict';

const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const inlineSource = require('gulp-inline-source');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pixels-to-rem');
const prettify = require('gulp-html-prettify');
const stylelint = require('stylelint');
const reporter = require('postcss-reporter');
const config = require('./.buildconfig.json');

const BUILD_DIRECTORY = 'dist/';
const TMP_DIRECTORY = '.tmp/';

gulp.task('clean', () => del([BUILD_DIRECTORY]));

gulp.task('styles', () => {
  return gulp.src(['src/*.css'])
    .pipe(postcss([
      pxtorem(config.pxtorem),
      stylelint(),
      reporter({
        clearReportedMessages: true,
      }),
      autoprefixer(config.autoprefixer),
    ]))
    .pipe(gulp.dest(TMP_DIRECTORY));
});

gulp.task('build:dist', ['clean', 'styles'], () => {
  return gulp.src(['src/*.html'])
    .pipe(inlineSource({
      compress: false,
      swallowErrors: true,
    }))
    .pipe(prettify(config.prettify))
    .pipe(gulp.dest(BUILD_DIRECTORY));
});

gulp.task('start-browsersync', () => {
  return browserSync.init(config.browsersync);
});

gulp.task('watch:sources', () => {
  gulp.watch(['src/*'], ['styles', 'build:dist']);
});

gulp.task('watch:dist', () => {
  gulp.watch([
    '*.html',
    'dist/*.{html, js}',
    'test/**/*',
  ]).on('change', browserSync.reload);
});

gulp.task('serve', [
  'build:dist',
  'start-browsersync',
  'watch:sources',
  'watch:dist',
]);
