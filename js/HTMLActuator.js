class HTMLActuator {
  constructor() {
    this.tileContainer = document.querySelector('.tile-container');
    this.scoreContainer = document.querySelector('.score-container');
    this.bestContainer = document.querySelector('.best-container');
    this.messageContainer = document.querySelector('.game-message');

    this.score = 0;
  }

  // update the panel display based on the grid & metadata state
  actuate(grid, metadata) {
    window.requestAnimationFrame(() => {
      this.clearContainer(this.tileContainer);

      grid.cells.forEach((column) => {
        column.forEach((cell) => {
          if (cell) {
            this.addTile(cell);
          }
        });
      });

      this.updateScore(metadata.score);
      this.updateBestScore(metadata.bestScore);

      if (metadata.terminated) {
        if (metadata.over) {
          // You lose
          this.message(false);
        } else if (metadata.won) {
          // You win!
          this.message(true);
        }
      }
    });
  }

  // Continues the game (both restart and keep playing)
  continueGame() {
    this.clearMessage();
  }

  // remove all the child of the container
  clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  // add the tile to the grid with style & postion based on the value & state
  addTile(tile) {
    let wrapper = document.createElement('div');
    let inner = document.createElement('div');
    let position = tile.previousPosition || { x: tile.x, y: tile.y };
    let positionClass = this.positionClass(position);

    // We can't use classlist because it somehow glitches when replacing classes
    let classes = ['tile', 'tile-' + tile.value, positionClass];

    if (tile.value > 2048) {
      classes.push('tile-super');
    }

    this.applyClasses(wrapper, classes);

    inner.classList.add('tile-inner');
    inner.textContent = tile.value;

    if (tile.previousPosition) {
      // Make sure that the tile gets rendered in the previous position first
      window.requestAnimationFrame(() => {
        classes[2] = this.positionClass({ x: tile.x, y: tile.y });
        // Update the position
        this.applyClasses(wrapper, classes);
      });
    } else if (tile.mergedFrom) {
      classes.push('tile-merged');
      this.applyClasses(wrapper, classes);

      // Render the tiles that merged
      tile.mergedFrom.forEach((merged) => {
        this.addTile(merged);
      });
    } else {
      classes.push('tile-new');
      this.applyClasses(wrapper, classes);
    }

    // Add the inner part of the tile to the wrapper
    wrapper.appendChild(inner);

    // Put the tile on the board
    this.tileContainer.appendChild(wrapper);
  }

  // set the class attribute of the element
  applyClasses(element, classes) {
    element.setAttribute('class', classes.join(' '));
  }

  // get real position of grid with human sense
  normalizePosition(position) {
    return { x: position.x + 1, y: position.y + 1 };
  }

  // connect the position to get the className of the tile
  positionClass(position) {
    position = this.normalizePosition(position);
    return 'tile-position-' + position.x + '-' + position.y;
  }

  // update the score
  updateScore(score) {
    this.clearContainer(this.scoreContainer);

    let difference = score - this.score;
    this.score = score;

    this.scoreContainer.textContent = this.score;

    if (difference > 0) {
      let addition = document.createElement('div');
      addition.classList.add('score-addition');
      addition.textContent = '+' + difference;

      this.scoreContainer.appendChild(addition);
    }
  }

  // update the best score
  updateBestScore(bestScore) {
    this.bestContainer.textContent = bestScore;
  }

  // show message
  message(won) {
    let type = won ? 'game-won' : 'game-over';
    let message = won ? 'You win!' : 'Game over!';

    this.messageContainer.classList.add(type);
    this.messageContainer.getElementsByTagName('p')[0].textContent = message;
  }

  // clear the message style
  clearMessage() {
    // takes one value to remove at a time.
    this.messageContainer.classList.remove('game-won');
    this.messageContainer.classList.remove('game-over');
  }
}
