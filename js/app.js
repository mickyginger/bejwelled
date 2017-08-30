// TODO move all data-attributes to arrays of indecies to reduce DOM modification
// TODO break up cell click handler

const gems = ['ruby', 'sapphire', 'diamond', 'emerald', 'quartz'];
const width = 10;
let $cells = null;
let score = 0;
let started = false;

const $grid = $('.grid');
const $score = $('.score');

function makeGrid() {
  for (var i = 0; i < width * width; i++) {
    $grid.append($('<div />'));
  }
  $cells = $grid.find('div');
}

function randomizeEmptyCells() {
  $cells.not('.ruby, .sapphire, .diamond, .emerald, .quartz').each((i, cell) => {
    $(cell).addClass(gems[Math.floor(Math.random() * gems.length)]);
  });
}

function getRows() {
  let i = width;
  const rows = [];
  while(i--) {
    rows.push($cells.slice(i * width, i * width + width).toArray());
  }
  return rows;
}

function getColumns() {
  let i = width;
  const cols = [];
  while(i--) {
    const col = [];
    for (let j = 0; j < width; j++) {
      col.push($cells[i+width*j]);
    }
    cols.push(col);
  }
  return cols;
}

function findStreaks(lines) {
  lines.forEach(line => {
    const $line = $(line);
    let count = 1;
    let lastGem = null;
    $line.each((i, cell) => {
      const gem = cell.classList[0];
      if(gem === lastGem) count++;
      else count = 1;
      lastGem = gem;
      if(count >= 3) $line.slice(i-count+1, i+1).attr('data-to-remove', true);
    });
  });
}

function removeStreaks(next) {
  const $cellsToRemove = $cells.filter('[data-to-remove=true]');
  if($cellsToRemove.length === 0) return next();
  setTimeout(() => {
    $cellsToRemove.removeAttr('class data-to-remove');
    if(started) score += $cellsToRemove.length * 100;
    $score.html(score);
    next();
  }, started ? 500 : 0);
}

function removeBlanks(next) {
  getColumns().forEach(col => {
    const gems = col.map(cell => cell.classList[0]).filter(gem => !!gem).reverse();
    if(gems.length < width) {
      col.reverse().forEach((cell, i) => $(cell).removeAttr('data-to-remove class').addClass(gems[i]));
    }
  });
  return setTimeout(next, started ? 500 : 0);
}

function updateGrid() {
  $grid.addClass('updating');
  removeStreaks(() => {
    removeBlanks(() => {
      randomizeEmptyCells();
      findStreaks(getRows());
      findStreaks(getColumns());

      if($('[data-to-remove]').length > 0) {
        updateGrid();
      } else {
        $grid.removeClass('updating');
        started = true;
      }
    });
  });
}

let $cellToMove = null;
let $cellToSwap = null;

$grid.on('click', 'div', (e) => {
  if($grid.hasClass('updating')) return false;
  if(!$cellToMove) {
    $cellToMove = $(e.target);
    const cellIndex = $cellToMove.index();
    const possibleMoveMatrix = [cellIndex-1, cellIndex+1, cellIndex-width, cellIndex+width];
    $cells.filter((i) => {
      return possibleMoveMatrix.includes(i);
    }).attr('data-possible-move', true);
  } else {
    $cellToSwap = $(e.target);

    const gemToMove = $cellToMove[0].classList[0];
    const gemToSwap = $cellToSwap[0].classList[0];
    $cellToMove.removeAttr('class').addClass(gemToSwap);
    $cellToSwap.removeAttr('class').addClass(gemToMove);

    findStreaks(getRows());
    findStreaks(getColumns());

    if($('[data-to-remove]').length > 0 && $cellToSwap.attr('data-possible-move')) {
      $cellToMove = null;
      $cellToSwap = null;
      updateGrid();
    } else {
      setTimeout(() => {
        $cellToMove.removeAttr('class').addClass(gemToMove);
        $cellToSwap.removeAttr('class').addClass(gemToSwap);
        $cellToMove = null;
        $cellToSwap = null;
      }, 250);
    }

    $cells.removeAttr('data-possible-move');
  }
});


makeGrid();
updateGrid();
