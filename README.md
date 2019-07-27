# Bejewelled

> An implementation of Bejeweled, using JavaScript

<img src="https://user-images.githubusercontent.com/3531085/61997791-ebdd9700-b09e-11e9-8f1f-1cd4f8010713.png">

Play online here: https://mickyginger.github.io/bejewelled/

## Technologies used

- HTML5
- CSS3
- ES6
- jQuery
- ~~gulp~~
- Webpack

## Approach

The grid is made up of 10 columns, all of which extend above the grid, so that new jewels can drop down from above.

The user moves cells by clicking on the jewel they want to move, then clicking on where they want to move it. If the move is valid the whole grid is analysed for lines of matching jewels. The lines are then removed leaving space for jewels above to fall in to the empty space.

The process is repeated until there are no more lines left to remove. The user then makes another go.

## Challenges

The biggest challenge was the recursive function that checks the board for matches.

The grid is split up in to 10 columns and 10 rows, then each cell in each column and row is checked for lines of three or more. Duplicates are removed, then the total number of cells to be removed is used to calculate the score to be awarded. The cells are remove, then the function is called again to remove any new lines:

```js
function getStreakFromLine(streak, line) {
  let count = 0;
  let lastGem = null;
  line.forEach((cell, i, line) => {
    const gem = $(cell).attr('class');

    if(gem === lastGem) {
      count++;
      if(line[line.length-1] === line[i] && count >= 3) {
        streak = streak.concat(line.slice(i-count+1, i+1));
      }
    } else {
      if(count >= 3) {
        streak = streak.concat(line.slice(i-count, i));
      }
      count = 1;
    }

    lastGem = gem;
  });
  return streak;
}
```

Once completed the next issue was the animation of the jewels. The speed of the animation needed to be different for horizontal and vertical lines. I used an easing plugin for jQuery to make the effect more realistic.

## Contributing

Please fork the repo and make a pull request.

If you'd rather just take the code and develop it please credit me and drop me a link to your repo, I'd love to take a look!
