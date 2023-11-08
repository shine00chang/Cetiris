onmessage = e => {
  const cmd = Array.isArray(e.data) ? e.data[0] : e.data;
  const args = Array.isArray(e.data) ? e.data.slice(1) : undefined;

  if (cmd == "location") {
    const location = args[0];
    console.log(location);
    init(location);
  }
}

const init = async (location) => {
  console.log("location: ", location);
  // Load wasm
  importScripts(location + "/wasm/wasm_driver.js");

  await wasm_bindgen(location + "/wasm/wasm_driver_bg.wasm");
  postMessage("init-done");

  // Start bot
  const { Wrapper, Input, Piece, Key } = wasm_bindgen;
  const Bot = Wrapper.new(6);


  // Type conversion
  function to_wasm_piece (js_v) {
    if (js_v === undefined || js_v === null) return Piece.None;

    switch (js_v) {
      case "T": return Piece.T;
      case "I": return Piece.I;
      case "O": return Piece.O;
      case "J": return Piece.J;
      case "L": return Piece.L;
      case "S": return Piece.S;
      case "Z": return Piece.Z;

      case 0: return Piece.L;
      case 1: return Piece.J;
      case 2: return Piece.Z;
      case 3: return Piece.S;
      case 4: return Piece.I;
      case 5: return Piece.O;
      case 6: return Piece.T;

      default: return Piece.None;
    }
  }

  // Runs the bot for a certain state and interval
  function run(state, delay) {
    console.log("== run start ==");

    run_start = Date.now();

    //Make Input
    const input = Input.new();
    for (let y=0; y<20; y++) 
      for (let x=0; x<10; x++)
        // Can't use  "occupied" function because class is not imported.
        if (state.board.board[y][x] != '-') 
          input.set_board(x, 19-y);

    input.set_hold(to_wasm_piece(state.hold));
    for (let i=0; i<state.queue.length; i++)
      input.set_pieces(i, to_wasm_piece(state.queue[i]));

    // Advance
    Bot.advance(input);

    // Set get solution timeout
    const output = Bot.run(delay);
    const keys = [];

    // Parse output into array of keys
    const add = k => {
      keys.push(k);
    }

    let key = output.next();
    while (true) {
      if (key == Key.L)    add("ArrowLeft");
      if (key == Key.R)    add("ArrowRight");
      if (key == Key.CW)   add("ArrowUp");
      if (key == Key.CCW)  add("z");
      if (key == Key.Drop) add("ArrowDown");
      if (key == Key.Hold) add("c");
      if (key == Key.HardDrop) { add(" "); break; }
      key = output.next();
    }
    // cancel das
    keys.push("das-up");

    return keys;
  }

  onmessage = e => {
    const cmd = Array.isArray(e.data) ? e.data[0] : e.data;
    const args = Array.isArray(e.data) ? e.data.slice(1) : undefined;

    if (cmd == "run") {
      if (!args) return console.error("No args received, expected state.");
      if (args.length != 2) return console.error("args length wrong, expected 2: ", args);
      postMessage(["solution", run(args[0], args[1])])
    }
  }
}
