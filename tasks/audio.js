const gulp             = require('gulp');
const clean            = require('gulp-clean');
const eventStream      = require('event-stream');
const browserSync      = require('browser-sync');
const config           = require('../package').gulp;

const cleanAudio = () => {
  return gulp.src(config.dest.audio, { read: false })
    .pipe(clean());
};

const copyAudio = () => {
  return gulp.src(`${config.src.audio}${config.selectors.audio}`)
    .pipe(gulp.dest(config.dest.audio));
};

const buildAudio = () => {
  return eventStream.merge(
    cleanAudio(),
    copyAudio()
  ).pipe(browserSync.stream());
};

gulp.task('build-audio', buildAudio);
module.exports = buildAudio;
