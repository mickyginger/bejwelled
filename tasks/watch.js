const gulp             = require('gulp');
const config           = require('../package').gulp;

const watch = () => {
  gulp.watch(`${config.src.scss}${config.selectors.scss}`, ['build-css']);
  gulp.watch(`${config.src.js}${config.selectors.js}`, ['build-js']);
  gulp.watch(`${config.src.images}${config.selectors.images}`, ['build-images']);
  gulp.watch(`${config.src.audio}${config.selectors.audio}`, ['build-audio']);
  gulp.watch(`${config.srcDir}${config.main.index}`, ['build-index']);
};

gulp.task('watch', watch);
module.exports = watch;
