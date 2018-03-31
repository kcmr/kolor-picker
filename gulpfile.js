'use strict';

const path = require('path');
const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const processInline = require('gulp-process-inline');
const inlineSource = require('gulp-inline-source');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pixels-to-rem');
const prettify = require('gulp-html-prettify');
const stylelint = require('stylelint');
const reporter = require('postcss-reporter');
const reporterFormatter = require('postcss-reporter/lib/formatter');
const component = path.basename(__dirname);
const config = require('./.buildconfig.json');

const BUILD_DIRECTORY = 'dist/';

gulp.task('clean', () => del([BUILD_DIRECTORY]));

gulp.task('build:dist', ['clean'], () => {
  const files = processInline();
  const customFormatter = reporterFormatter();

  return gulp.src(['src/*.html'])
    .pipe(inlineSource({
      compress: false,
      swallowErrors: true,
    }))
    .pipe(files.extract('style'))
    .pipe(postcss([
      pxtorem(config.pxtorem),
      stylelint(),
      reporter({
        clearReportedMessages: true,
        formatter: function(params) {
          /* eslint-disable no-console */
          console.log(customFormatter({
            source: `src/${component}.css`,
            messages: params.messages,
          }));
          /* eslint-enable no-console */
        },
      }),
      autoprefixer(config.autoprefixer),
    ]))
    .pipe(files.restore())
    .pipe(prettify(config.prettify))
    .pipe(gulp.dest(BUILD_DIRECTORY));
});

gulp.task('start-browsersync', () => {
  return browserSync.init(config.browsersync);
});

gulp.task('watch:sources', () => {
  gulp.watch(['src/*'], ['build:dist']);
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
