class FakeStorage {
  _data = {};
  _instance = null;

  getInstance() {
    if (!FakeStorage._instance) {
      FakeStorage._instance = new FakeStorage();
    }
    return FakeStorage._instance;
  }

  setItem(id, val) {
    return (this._data[id] = String(val));
  }

  getItem(id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  }

  removeItem(id) {
    return delete this._data[id];
  }

  clear() {
    return (this._data = {});
  }
}

class LocalStorageManager {
  constructor() {
    this.bestScoreKey = 'bestScore';
    this.gameStateKey = 'gameState';

    let supported = this.localStorageSupported();
    this.storage = supported ? window.localStorage : FakeStorage.getInstance();
  }

  localStorageSupported() {
    let testKey = 'test';

    try {
      let storage = window.localStorage;
      storage.setItem(testKey, '1');
      storage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Best score getters/setters
  getBestScore() {
    return this.storage.getItem(this.bestScoreKey) || 0;
  }

  setBestScore(score) {
    this.storage.setItem(this.bestScoreKey, score);
  }

  // Game state getters/setters and clearing
  getGameState() {
    let stateJSON = this.storage.getItem(this.gameStateKey);
    return stateJSON ? JSON.parse(stateJSON) : null;
  }

  setGameState(gameState) {
    this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
  }

  clearGameState() {
    this.storage.removeItem(this.gameStateKey);
  }
}
