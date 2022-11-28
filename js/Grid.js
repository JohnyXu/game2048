class Grid {
  constructor(size, previousState) {
    this.size = size;
    this.cells = previousState ? this.fromState(previousState) : this.empty();
  }

  // Build a grid of the specified size
  empty() {
    let cells = [];

    for (let x = 0; x < this.size; x++) {
      let row = (cells[x] = []);

      for (let y = 0; y < this.size; y++) {
        row.push(null);
      }
    }

    return cells;
  }

  // build the grid from the previous state
  fromState(state) {
    let cells = [];

    for (let x = 0; x < this.size; x++) {
      let row = (cells[x] = []);

      for (let y = 0; y < this.size; y++) {
        let tile = state[x][y];
        row.push(tile ? new Tile(tile.position, tile.value) : null);
      }
    }

    return cells;
  }

  // Find the first available random position
  randomAvailableCell() {
    let cells = this.availableCells();

    if (cells.length) {
      return cells[Math.floor(Math.random() * cells.length)];
    }
  }

  // check whether exist empty cell or not in the grid
  availableCells() {
    let cells = [];

    this.eachCell((x, y, tile) => {
      if (!tile) {
        cells.push({ x: x, y: y });
      }
    });

    return cells;
  }

  // Call callback for every cell
  eachCell(callback) {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        callback(x, y, this.cells[x][y]);
      }
    }
  }

  // Check if there are any cells available
  cellsAvailable() {
    return !!this.availableCells().length;
  }

  // Check if the specified cell is taken
  cellAvailable(cell) {
    return !this.cellOccupied(cell);
  }

  // the cell is occupied
  cellOccupied(cell) {
    return !!this.cellContent(cell);
  }

  // get the cell with position(x,y)
  cellContent(cell) {
    if (this.withinBounds(cell)) {
      return this.cells[cell.x][cell.y];
    } else {
      return null;
    }
  }

  // Inserts a tile at its position
  insertTile(tile) {
    this.cells[tile.x][tile.y] = tile;
  }

  // remove the tile with position(x,y)
  removeTile(tile) {
    this.cells[tile.x][tile.y] = null;
  }

  // check valid position
  withinBounds(position) {
    return position.x >= 0 && position.x < this.size && position.y >= 0 && position.y < this.size;
  }

  // get serialize data for the grid
  serialize() {
    let cellState = [];

    for (let x = 0; x < this.size; x++) {
      let row = (cellState[x] = []);

      for (let y = 0; y < this.size; y++) {
        row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
      }
    }

    return {
      size: this.size,
      cells: cellState,
    };
  }
}
