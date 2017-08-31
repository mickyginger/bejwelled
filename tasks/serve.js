const gulp             = require('gulp');
const browserSync      = require('browser-sync').create();

const serve = () => {
  browserSync.init(null, {
    server: { baseDir: './public' },
    files: ['public/**/*.*'],
    browser: 'google chrome',
    port: 7000,
    reloadDelay: 1000
  });
};

gulp.task('serve', serve);
module.exports = serve;