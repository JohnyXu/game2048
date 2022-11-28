class Tile {
  constructor(position, value) {
    this.x = position.x;
    this.y = position.y;
    this.value = value || 2;

    this.previousPosition = null;

    // Tracks tiles that merged together
    this.mergedFrom = null;
  }

  // save the position to previous
  savePosition() {
    this.previousPosition = { x: this.x, y: this.y };
  }

  // update current position
  updatePosition(position) {
    this.x = position.x;
    this.y = position.y;
  }

  // serialize the data for tile
  serialize() {
    return {
      position: {
        x: this.x,
        y: this.y,
      },
      value: this.value,
    };
  }
}
