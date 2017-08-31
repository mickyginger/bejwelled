const gulp             = require('gulp');
const eventStream      = require('event-stream');
const buildIndex       = require('./index');
const buildImages      = require('./images');
const buildAudio       = require('./audio');

const buildApp = function() {
  return eventStream.merge(
    buildIndex(),
    buildImages(),
    buildAudio()
  );
};

gulp.task('build-app', ['clean'], buildApp);
module.exports = buildApp;
