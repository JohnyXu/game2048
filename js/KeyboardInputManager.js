class KeyboardInputManager {
  constructor() {
    this.events = {};

    this.eventTouchstart = 'touchstart';
    this.eventTouchmove = 'touchmove';
    this.eventTouchend = 'touchend';

    this.listen();
  }

  // register event with related callback function
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  // trigger event with the data for callback
  emit(event, data) {
    let callbacks = this.events[event];
    if (callbacks) {
      callbacks.forEach((callback) => {
        callback(data);
      });
    }
  }

  // listen to the keyboard event and touch event
  listen() {
    let map = {
      ArrowUp: 0, // Up
      ArrowRight: 1, // Right
      ArrowDown: 2, // Down
      ArrowLeft: 3, // Left
      k: 0, // Vim up
      l: 1, // Vim right
      j: 2, // Vim down
      h: 3, // Vim left
      w: 0, // W
      d: 1, // D
      s: 2, // S
      a: 3, // A
    };

    // Respond to direction keys
    document.addEventListener('keydown', (event) => {
      console.log(event.key);
      let modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
      let mapped = map[event.key];

      if (!modifiers) {
        if (mapped !== undefined) {
          event.preventDefault();
          this.emit('move', mapped);
        }
      }

      // R key restarts the game
      if (!modifiers && event.key === 'r') {
        this.restart.call(this, event);
      }
    });

    // Respond to button presses
    this.bindButtonPress('.retry-button', this.restart);
    this.bindButtonPress('.restart-button', this.restart);
    this.bindButtonPress('.keep-playing-button', this.keepPlaying);

    // Respond to swipe events
    let touchStartClientX, touchStartClientY;
    let gameContainer = document.getElementsByClassName('game-container')[0];

    gameContainer.addEventListener(this.eventTouchstart, (event) => {
      if (event.targetTouches.length > 1) {
        // Ignore if touching with more than 1 finger
        return;
      }

      touchStartClientX = event.touches[0].clientX;
      touchStartClientY = event.touches[0].clientY;

      event.preventDefault();
    });

    gameContainer.addEventListener(this.eventTouchmove, (event) => {
      event.preventDefault();
    });

    gameContainer.addEventListener(this.eventTouchend, (event) => {
      if (event.targetTouches.length > 0) {
        // Ignore if still touching with one or more fingers
        return;
      }

      let touchEndClientX, touchEndClientY;

      touchEndClientX = event.changedTouches[0].clientX;
      touchEndClientY = event.changedTouches[0].clientY;

      let dx = touchEndClientX - touchStartClientX;
      let absDx = Math.abs(dx);

      let dy = touchEndClientY - touchStartClientY;
      let absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) > 10) {
        // (right : left) : (down : up)
        this.emit('move', absDx > absDy ? (dx > 0 ? 1 : 3) : dy > 0 ? 2 : 0);
      }
    });
  }

  restart(event) {
    event.preventDefault();
    this.emit('restart');
  }

  keepPlaying(event) {
    event.preventDefault();
    this.emit('keepPlaying');
  }

  bindButtonPress(selector, fn) {
    let button = document.querySelector(selector);
    button.addEventListener('click', fn.bind(this));
    button.addEventListener(this.eventTouchend, fn.bind(this));
  }
}
