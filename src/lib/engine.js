import Config from './config.js';


export class Piece {
  static basic (type) {
    if (type == "J") return [{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}, {x: -1, y: 1}];
    if (type == "L") return [{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}, {x:  1, y: 1}];
    if (type == "S") return [{x: -1, y: 0}, {x: 0, y: 0}, {x: 0, y: 1}, {x:  1, y: 1}];
    if (type == "Z") return [{x: -1, y: 1}, {x: 0, y: 1}, {x: 0, y: 0}, {x:  1, y: 0}];
    if (type == "T") return [{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}, {x:  0, y: 1}];
    if (type == "I") return [{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}, {x:  2, y: 0}];
    if (type == "O") return [{x:  0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x:  1, y: 1}];

    return console.error("Piece.cells() got unknown piece: ", type);
  }

  /* Offsets of a certain type of piece at a rotation */
  static offset (type, r) {
    return Piece.basic(type).map(({x, y}) => {
      if (r == 0) return {x: x, y: y}
      if (r == 1) return {x:  y, y: -x}
      if (r == 2) return {x: -x, y: -y}
      if (r == 3) return {x: -y, y:  x}

      return console.log("Piece.offset() got invalide rotation: ", r);
    })
  }

  static cells (type, r, dx, dy) {
    return Piece.offset(type, r).map(({x, y}) => { return { x: x + dx, y: y + dy } });
  }

  static rawKicks (type, r) {
    if (type == "O") { 
      if (r == 0) return Array.from({length: 5}, () => {return {x: 0, y: 0}});
      if (r == 1) return Array.from({length: 5}, () => {return {x: 0, y:-1}});
      if (r == 2) return Array.from({length: 5}, () => {return {x:-1, y:-1}});
      if (r == 3) return Array.from({length: 5}, () => {return {x:-1, y: 0}});
    }
    if (type == "I") {
      if (r == 0) return [{x:  0, y: 0}, {x: -1, y: 0}, {x:  2, y: 0}, {x: -1, y:  0}, {x:  2, y: 0}];
      if (r == 1) return [{x: -1, y: 0}, {x:  0, y: 0}, {x:  0, y: 0}, {x:  0, y:  1}, {x:  0, y:-2}];
      if (r == 2) return [{x: -1, y: 1}, {x:  1, y: 1}, {x: -2, y: 1}, {x:  1, y:  0}, {x: -2, y: 0}];
      if (r == 3) return [{x:  0, y: 1}, {x:  0, y: 1}, {x:  0, y: 1}, {x:  0, y: -1}, {x:  0, y: 2}];
    }
    if (r == 0) return Array.from({length: 5}, () => {return {x: 0, y: 0}});
    if (r == 1) return [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0, y: 2}, {x: 1, y: 2}];
    if (r == 2) return Array.from({length: 5}, () => {return {x: 0, y: 0}});
    if (r == 3) return [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: -1}, {x: 0, y: 2}, {x: -1, y: 2}];
  }

  /* Generates the kicks */
  static kicks(type, r, nr) {
    const a = this.rawKicks(type, r);
    const b = this.rawKicks(type, nr);
    const out = [];
    
    for (let i=0; i<5; i++) {
      out.push({
        x: a[i].x - b[i].x,
        y: a[i].y - b[i].y
      });
    }

    return out;
  }
}

class Move {
  constructor () {
    this.x = 4;
    this.y = 19;
    this.r = 0;
  }
  
  /* Returns the positions of the cells produced by this move for piece */
  cells (type) {
    return Piece.cells(type, this.r, this.x, this.y);
  }

  /* Move horizontally if valid */
  move (type, board, dx) 
  {
    let ok = true;
    for (const {x, y} of this.cells(type)) {
      ok &= !board.conflict(x + dx, y);
    }

    if (ok) {
      this.x += dx;
    }
  }

  /* Auto shift */
  das (type, board, dx) {
    while (true) {
      const px = this.x;
      this.move(type, board, dx);
      if (px == this.x) return;
    }
  }

  rotate (type, board, dr) 
  {
    if (dr == 1) this.rotate_(type, board, (this.r + 1) % 4);
    if (dr == 2) this.rotate_(type, board, (this.r + 2) % 4);
    if (dr == -1) this.rotate_(type, board, this.r == 0 ? 3 : this.r - 1);
  }

  rotate_ (type, board, nr) 
  {
    const prevr = this.r;
    this.r = nr;

    // Attempt Kicks
    for (const {x: dx, y: dy} of Piece.kicks(type, prevr, nr)) {
      let ok = true;
      for (const {x, y} of this.cells(type)) {
        ok &= !board.conflict(x + dx, y + dy);
      }     

      // If failed, try next
      if (!ok) continue;

      // If success, set deltas and continue
      this.x += dx;
      this.y += dy;
      return;
    }

    // If all kicks failed
    this.r = prevr;
  }

  hardDrop (type, board) {
    let ok = true;
    while (true) {
      for (const {x, y} of this.cells(type)) {
        ok &= !board.conflict(x, y-1);
      }

      if (ok) this.y--;
      else break;
    }
  }

  // Moves placement down by one if possible
  softDrop (type, board) {
    let ok = true;
    for (const {x, y} of this.cells(type)) {
      ok &= !board.conflict(x, y-1);
    }
    if (!ok) return;
    this.y --;
  }

  // Returns true if the piece is touching the stack
  inContact (type, board) {
    let contacts = false;
    for (const {x, y} of this.cells(type)) {
      contacts |= board.conflict(x, y-1);
    }
    return contacts;
  }

  // Returns true if the piece is in the stack (game over check)
  conflicts (type, board) {
    let contacts = false;
    for (const {x, y} of this.cells(type)) {
      contacts |= board.conflict(x, y);
    }
    return contacts;
  }

  // 3-corner check
  isTspin (type, board) {
    if (type != 'T') return false;
    let cnt = 0;
    cnt += board.conflict(this.x - 1, this.y - 1) ? 1 : 0;
    cnt += board.conflict(this.x - 1, this.y + 1) ? 1 : 0;
    cnt += board.conflict(this.x + 1, this.y + 1) ? 1 : 0;
    cnt += board.conflict(this.x + 1, this.y - 1) ? 1 : 0;

    return cnt >= 3;
  }
}

class Board {
  static HEIGHT = 25;
  constructor () {
    this.board = new Array(Board.HEIGHT).fill('-').map(() => new Array(10).fill('-'));
  }

  /* Checks if placing a block here would conflict or be invalid */
  conflict (x, y) {
    if (x >= 10 || x < 0 || y < 0 || y >= Board.HEIGHT) return true;
    return this.board[y][x] != '-';
  }

  /* Checks if grid is occupied */
  occupied (x, y) {
    if (x >= 10 || x < 0 || y < 0 || y >= Board.HEIGHT) return false;
    return this.board[y][x] != '-';
  }

  /* Adds piece to board
   * @return: (num) lines cleared
   */
  place (type, move) {

    // Add to board
    for (const {x, y} of move.cells(type)) {
      if (x >= 10 || x < 0 || y < 0 || y >= Board.HEIGHT) {
        console.error("Board::place() attempted to write to cell not in range.");
        continue;
      }
      this.board[y][x] = type;
    }

    // Clear lines
    let clears = 0;
    let dy = new Array(Board.HEIGHT);
    for (let y=0; y<Board.HEIGHT; y++) {
      const filled = this.board[y].reduce((a, b) => a &= b != '-', true);
      this.board[y-clears] = Array.from(this.board[y]);
      dy[y] = -clears;

      if (filled) {
        clears ++;
        dy[y] = 'cleared';
      }
    }

    return { clears, dy };
  }
}

export class Game {
  constructor () 
  {
    this.gravity_rate = 1;
    this.gravity_limit = 60;
    this.lock_limit = 1200;
  }
}

export class Stats {
  constructor () 
  {
    this.start = Date.now();
    this.attacks = 0;
    this.ds = 0;
    this.pieces = 0;
  }

  get () {
    const dt = Date.now() - this.start;
    const pps = this.pieces / (dt / 1000);
    const apm = this.attacks / (dt / 60000);

    return {
      attacks: this.attacks,
      pieces: this.pieces,
      ds: this.ds,
      pps,
      apm,
      vs: [ ( this.attacks + this.ds ) / this.pieces ] * pps * 100
    }
  }
}

export class State {
  constructor () {
    this.board = new Board();
    this.dy = new Array(Board.HEIGHT).fill(0);
    this.queue = [];
    this.hold = undefined;
    this.bag = [];
    this.move = new Move(); 
    this.das = undefined;

    this.combo = 0;
    this.b2b = 0;

    // Performance stats
    this.stats = new Stats();

    // Gravity
    this.gravity_tick = 0;
    this.lock_tick = 0;

    this.over = false;

    // Fill bag & queue
    this.draw();
  }

  /* Fills the queue */
  draw () 
  {
    while (this.queue.length < 6) {
      if (this.bag.length == 0) {
        this.bag = ["J", "L", "S", "Z", "T", "I", "O"];
      }

      const index = Math.floor(Math.random() * this.bag.length);
      const piece = this.bag.splice(index, 1);
      this.queue.push(piece);
    }
  }

  /* Called on refresh */
  applyInputs (inputs) {
    if (this.over) { 
      console.error("State::applyInputs() called despite state over");
      return;
    }

    // Reset DY
    this.dy = new Array(Board.HEIGHT).fill(0);

    // Process inputs
    for (const input of inputs) {
      applyKey(this, input);
    }

    // DAS 
    if (this.das != undefined && Date.now() - this.das.timestamp > Config.das) {
      this.move.das(this.queue[0], this.board, this.das.key == "ArrowLeft" ? -1 : 1);
      this.das = undefined;
    }
  }

  // Non-input state mutation
  refresh (game) 
  {
    if (this.over) { 
      console.error("State::refresh() called despite state over");
      return;
    }
    // Locking 
    if (this.move.inContact(this.queue[0], this.board)) {
      this.lock_tick += 1;
      if (this.lock_tick >= game.lock_limit) {
        this.place();
      }
    } else {
      this.lock_tick = 0;
    }

    // Gravity
    if (!this.move.inContact(this.queue[0], this.board)) {
      this.gravity_tick += game.gravity_rate;
      while (this.gravity_tick > game.gravity_limit) {
        this.move.softDrop(this.queue[0], this.board);
        this.gravity_tick -= game.gravity_limit;
      }
    }

    // Game over 
    if (this.move.conflicts(this.queue[0], this.board)) {
      this.over = true;
    }
  }

  /* For renderer */
  ghost () {
    const ghost = Object.assign(Object.create(Object.getPrototypeOf(this.move)), this.move);
    ghost.hardDrop(this.queue[0], this.board);

    return ghost;
  }

  // Places piece
  place () {
    const type = this.queue.shift()[0];
    const is_tspin = this.move.isTspin(type, this.board);
    const { clears, dy } = this.board.place(type, this.move);
    const attacks = this.calcAttacks(clears, is_tspin);
    this.dy = dy;

    // Update combo & b2b
    if (clears == 0) { this.combo = 0; }
    else this.combo ++;
    if (clears != 0 && !is_tspin && clears != 4) { this.b2b = 0; }
    if ((is_tspin && clears > 0) || clears == 4) this.b2b ++; 

    // Update stats
    this.stats.pieces ++;
    this.stats.ds += clears;
    this.stats.attacks += attacks;

    this.pieceChangeResets();
  }

  // Calculates attacks based on b2b and combo
  // NOTE: Does not mutate b2b nor combo
  calcAttacks (clears, is_tspin) {
    if (!is_tspin && clears < 4) {
      return clears + Math.floor(this.combo / 2);
    }
    const b2b_level = 
      this.b2b >= 1 ? 1 : 0 +
      this.b2b >= 3 ? 1 : 0 +
      this.b2b >= 8 ? 1 : 0 +
      this.b2b >= 24 ? 1 : 0;

    if (clears == 4) return 4 + b2b_level + this.combo;
    if (clears == 3) return 6 + b2b_level + this.combo;
    if (clears == 2) return 4 + b2b_level + this.combo;
    if (clears == 1) return 2 + b2b_level + this.combo;
    if (clears == 0) return 0;

    return console.error("State::calcAttacks() received invalid clears: ", clears);
  }

  swapHold () {
    if (this.hold == undefined) {
      this.hold = this.queue.shift()[0];
      this.draw();
    } else {
      const temp = this.hold;
      this.hold = this.queue[0];
      this.queue[0] = temp;
    }

    this.pieceChangeResets();
  }

  // States that need to be changed if the current piece changed. 
  // - Called only by State::place() and State:: hold().
  pieceChangeResets () {
    // Reset move & bag
    this.move = new Move();
    this.draw();

    // Note: don't reset DAS: DAS preservation
    
    // Reset lock & gravity tick
    this.lock_tick = 0;
    this.gravity_tick = 0;
  }
}

// Applies a single input to the state
function applyKey (state, input) {
  switch (input) {
    case "ArrowLeft": 
    case "ArrowRight": 
      state.move.move(state.queue[0], state.board, input == "ArrowLeft" ? -1 : 1);

      // Reset DAS
      state.das = {
        key: input,
        timestamp: Date.now()
      };
      break;

    case "ArrowUp":
      state.move.rotate(state.queue[0], state.board, 1);
      break;
    case "a":
      state.move.rotate(state.queue[0], state.board, 2);
      break;
    case "z":
      state.move.rotate(state.queue[0], state.board, -1);
      break;

    // Space
    case " ":
      const type = state.queue[0];
      state.move.hardDrop(type, state.board);
      state.place();
      break;

    case "ArrowDown":
      state.gravity_tick += Config.sdf;
      break;

    case "c": 
      state.swapHold();
      break; 

    case "das-up":
      state.das = undefined;
      break;
  }

  state.counter ++;
}
