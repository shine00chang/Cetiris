<script>
  import GameElem from '$lib/game/game.svelte';
  import BotGame from '$lib/game/botGame.svelte';

  import Config, { POLL_RATE } from '$lib/config.js';
  import { State, Game } from '$lib/engine.js';
  import { randString } from '$lib/rand.js';

  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  import workerURL from '$lib/bot.js?url';

  // NOTE: The bot assumes SDF to be instant.
  Config.sdf = 10000;

  const seed = randString(10);
  let game = new Game();
  let state = new State(seed);
  let stateBot = new State(seed);
  let inputs = [];
  let inputsBot = [];

  let startTime = undefined;
  let time = undefined;
  let win = false;

  const restart  = () => { onEnd(); document.location.reload(); } // Reload page, trigger on 'r'
  const escape   = () => { goto('/'); onEnd(); } // Return to menu, trigger on 'esc'
  const getfocus = (e) => e.focus(); // Get foucs

  // Worker
  let worker;
  let botPPS = 1.5;
  let botInterval;
  $: botInterval = 1000 / botPPS;

  function startWorker () {
    fetch(workerURL,
    {
        method: "GET",
        headers: {
            "Cross-Origin-Embedder-Policy": "credentialless",
            "Cross-Origin-Opener-Policy": "same-origin"
        }
    })
      .then(res => res.text())
      .then(workerFile => {
        console.log(workerFile);

        // Create blob
        let blob = new Blob([workerFile], {type: 'application/javascript'});
        worker = new Worker(URL.createObjectURL(blob));
        worker.lastMoveTime = 0;

        // Send location
        worker.postMessage(["location", window.location.origin]);

        // Callback on 'solution' message
        const onSolution = (inputs) => {
          // delay: time to wait before making move. (ms)
          const delay = botInterval - (Date.now() - worker.lastMoveTime);
          console.log(Date.now() - worker.lastMoveTime, delay);

          const func = () => {
            inputsBot.push(...inputs)
            worker.lastMoveTime = Date.now();
          };

          // if delay > 0, timeout. otherwise, add immediately.
          if (delay <= 0) {
            func();
          } else {
            setTimeout(func, delay);
          }
        }

        // Message callback
        worker.onmessage = e => {
          console.log(`message from worker: `, e.data);
          const msg = Array.isArray(e.data) ? e.data[0] : e.data;

          // Once done init, start first move to start the cycle:
          if (msg == "init-done") worker.postMessage(["run", stateBot, botInterval]);

          // If receieved solution, add to inputs.
          if (msg == "solution") onSolution(e.data[1]);
        }

        worker.onerror = e => console.log(`error from worker:`, e);
      });

  }

  // Open bot speed modal
  onMount(() => bot_speed_modal.showModal());

  // Called once modal is closed
  const start = () => {
    // Initialize time
    startTime = Date.now()
    
    // Clear inputs: keydown function still writes to inputs when modal is active.
    inputs = [];
    startWorker();
    startInterval();
  }


  // Checks for end condition, and nothing else
  // @return (bool) if game over
  const endCondition = () => {
    return state.over || stateBot.over;
  }

  // Does the necessary state-mutation on ending.
  const onEnd = () => {

    clearInterval(interval);

    // Stop worker
    if (worker != undefined) worker.terminate();

    win = stateBot.over;

    // Format time string
    {
      let ms = Date.now() - startTime;
      let s = Math.floor(ms / 1000);
      let m = Math.floor(s / 60);
      ms = (ms % 1000).toString().padStart(3, "0");
      s = (s % 60).toString()
      if (m != 0) s = s.padStart(2, "0");
      m = m.toString()
      time = m == 0 ? `${s}.${ms}` : `${m}:${s}.${ms}`;
    }

    // Set states: Necessary for game over overlay on the <Board> elements
    state.over = true;
    stateBot.over = true;
  }


  // Keydown Event
  const onKeyDown = (e) => {
    e.preventDefault();

    // Start timer
    if (startTime == undefined) startTime = Date.now();

    // Restart
    if (e.key == "r") restart();

    // escape
    if (e.key == "Escape") escape();

    // if game over
    if (state.over) return;

    if (e.key == "g") state.applyAttacks(4);

    inputs.push(e.key);
  }

  // Keyup Event - only for DAS
  const onKeyUp = (e) => {
    if (state.over) return;
    if (e.key == "ArrowLeft" || e.key == "ArrowRight") {
      inputs.push("das-up");
    }
  }


  // Refreshing
  let interval;
  function startInterval () {
    interval = setInterval(() => {
      if (inputsBot.length != 0) console.log("guh");
      
      state.applyInputs(game, inputs);
      state.refresh(game);

      stateBot.applyInputs(game, inputsBot);
      stateBot.refresh(game);

      // Exchange garbage
      state.applyAttacks(stateBot.attacks);
      stateBot.applyAttacks(state.attacks);
      
      // Workaroud for object reactivity
      state = state;
      stateBot = stateBot;

      // Check if bot made a move, start next solve.
      if (inputsBot.length != 0) {
        worker.postMessage(["run", stateBot, botInterval]);
      }

      // Clear inputs
      inputs = [];
      inputsBot = [];

      // Check end condition
      if (endCondition()) onEnd();
    }, 1000/POLL_RATE);
  }

</script>

<!-- Bot speed modal -->
<dialog id="bot_speed_modal" class="modal" on:close={start}>
  <div class="modal-box">
    <h3 class="font-bold text-lg">Bot Speed</h3>
    <div class="form-control w-full max-w-xs">
      <span class="text-md font-bold">
        <input type="number"class="text-right w-16" bind:value={botPPS}/>
        pps
      </span>
      <input type="range" min="0.5" max="3" step="0.1" bind:value={botPPS} class="range range-primary" />
    </div>

    <!-- start button -->
    <form method="dialog">
      <button class="btn">start</button>
    </form>
  </div>
</dialog>

<div class="flex gap-4">
  <div use:getfocus tabindex="0" on:keydown={onKeyDown} on:keyup={onKeyUp}
    class="w-full h-full">
    <GameElem state={state} win={win}>
      <div slot="lose" class="mx-auto relative mt-36 text-center text-3xl font-black tracking-widest italic">
        <div>Game Over</div>
        <div class="text-xl font-black tracking-widest italic">{time}</div>
      </div>
      <div slot="win" class="mx-auto relative mt-36 text-center">
        <div>You Win!</div>
        <div class="text-xl font-black tracking-widest italic">{time}</div>
      </div>
    </GameElem>
  </div>

  <BotGame state={stateBot}>
    <div slot="lose" class="mx-auto relative mt-36 text-center text-3xl font-black tracking-widest italic">
      Game Over
    </div>
  </BotGame>
</div>
