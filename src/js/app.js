import $ from 'jquery';
import 'jquery.easing';

import '../scss/style.scss';

const gems = ['amethyst', 'topaz', 'diamond', 'opal', 'ruby', 'sapphire'];
const width = 10;
const matchAudio = new Audio('../audio/match.mp3');
let score = 0;
let hiScore = window.localStorage.getItem('hiScore') || 0;

const $body = $('body');
const $grid = $('.grid');
const $score = $('.score');
const $hiScore = $('.hi-score');
const $timer = $('.timer');
const $playAgain = $('.again');
const $currentStreak = $('.current-streak');
let timerId = null;
let currentTime = 60;
let gameOver = false;

let $movingGem = null;
let possibleMoves = [];
let currentStreakLength = 0;

$hiScore.text(hiScore);

$body.addClass(getRandomGem());

function startTimer() {
  if(timerId) clearInterval(timerId);
  $timer.html(currentTime);
  timerId = setInterval(() => {
    currentTime--;
    $timer.html(currentTime);
    if(currentTime === 0) {
      clearInterval(timerId);
      timerId = null;
      endGame();
    }
  }, 1000);
}

function makeGrid() {
  $grid.empty();
  let cols = width;
  while(cols--) {
    const $col = $('<div />', { class: 'col' });
    for (let i = 0; i < width; i++) {
      const $cell = $('<div />', { class: getRandomGem() });
      $col.append($cell);
    }
    $grid.append($col);
  }

  while(removeStreaks(true));
}

function getRandomGem() {
  return gems[Math.floor(Math.random() * gems.length)];
}

function getLines() {
  const lines = [];
  let i = width;
  while(i--) {
    lines.push([]);
  }

  $grid.find('.col div').each((i, cell) => lines[i%width].push(cell));

  $grid.find('.col').each((i, col) => lines.push($(col).find('div').toArray()));

  return lines;
}

function getStreakFromLine(streak, line) {
  let count = 0;
  let lastGem = null;
  line.forEach((cell, i, line) => {
    const gem = cell.className;

    if(gem === lastGem) {
      count++;
      if(line[line.length-1] === line[i] && count >= 3) streak = streak.concat(line.slice(i-count+1, i+1));
    } else {
      if(count >= 3) streak = streak.concat(line.slice(i-count, i));
      count = 1;
    }

    lastGem = gem;
  });
  return streak;
}

function findStreaks() {
  const lines = getLines();
  const streaks = lines.reduce(getStreakFromLine, []);
  return Array.from(new Set(streaks));
}

function updateScore(streak) {
  score += streak * 100;

  switch(true) {
    case streak > 15:
      score *= 2.5;
      break;
    case streak >= 15:
      score *= 2.25;
      break;
    case streak >= 12:
      score *= 2;
      break;
    case streak >= 9:
      score *= 1.75;
      break;
    case streak >= 6:
      score *= 1.5;
      break;
  }

  score = Math.round(score);

  $score.text(score);
}

function removeStreaks(noDelay) {
  const streaks = findStreaks();
  if(streaks.length === 0 && !noDelay) {
    updateScore(currentStreakLength);
  }
  if(streaks.length > 0 && !noDelay) {
    currentStreakLength += streaks.length;
    $currentStreak.text(currentStreakLength);
    matchAudio.pause();
    matchAudio.currentTime = 0;
    matchAudio.play();
  }
  let animationCount = 0;
  streaks.forEach(cell => {
    const $cell = $(cell);
    const $col = $cell.parent();

    if(noDelay) {
      $cell
        .removeAttr('class')
        .appendTo($col)
        .addClass(getRandomGem());
    } else {
      const delay = $cell.prev().is(':animated') ? 800 : 400;
      $col
        .append($('<div />', { class: getRandomGem() }));

      $cell
        .removeAttr('class')
        .animate({ height: 0 }, delay, 'easeOutBounce', () => {

          $cell.remove();

          animationCount++;
          if(streaks.length && animationCount === streaks.length) removeStreaks();
        });
    }
  });
  if(noDelay) return streaks.length;
}

function establishPossibleMoves($cell){
  const cellIndex = $cell.index();
  const $col = $cell.parent();
  return possibleMoves.push(
    $cell.prev().get(0),
    $cell.next().get(0),
    $col.prev().find('div').eq(cellIndex).get(0),
    $col.next().find('div').eq(cellIndex).get(0)
  );
}

function swapClasses($a, $b) {
  const classA = $a.attr('class');
  const classB = $b.attr('class');

  $a.attr('class', classB);
  $b.attr('class', classA);
}

function moveGem() {
  if(gameOver) return false;
  currentStreakLength = 0;
  if(!timerId) startTimer();
  const $cell = $(this);
  $grid.find('.pulse').removeClass('pulse');
  if(!$movingGem) {
    $cell.addClass('pulse');
    $movingGem = $cell;
    return establishPossibleMoves($cell);
  }

  if(possibleMoves.includes(this)) {

    swapClasses($movingGem, $cell);

    const streaks = findStreaks();
    return setTimeout(() => {
      if(streaks.length === 0) swapClasses($movingGem, $cell);
      else removeStreaks();
      possibleMoves = [];
      $movingGem = null;
    }, 500);

  }

  if($cell.is($movingGem)) $movingGem = null;
}

function endGame() {
  if(score > hiScore) {
    hiScore = score;
    $hiScore.text(hiScore);
    window.localStorage.setItem('hiScore', hiScore);
  }

  gameOver = true;
  currentTime = 60;
  score = 0;
  $grid.find('.pulse').removeClass('pulse');
  possibleMoves = [];
  $movingGem = null;
  $playAgain.show();
}

function reset() {
  gameOver = false;
  makeGrid();
}

$grid.on('click', 'div:not(.col)', moveGem);
$playAgain.on('click', reset);

makeGrid();
