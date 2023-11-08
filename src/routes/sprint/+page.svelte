<script>
  import GameElem from '$lib/game/game.svelte';

  import { POLL_RATE } from '$lib/config.js';
  import { State, Game } from '$lib/engine.js';

  import { goto } from '$app/navigation';
  

  let game = new Game();
  let state = new State();
  let inputs = [];
  let win = false;
  let startTime = undefined;
  let time = undefined;

  const restart  = () => { onEnd(); document.location.reload(); } // Reload page, trigger on 'r'
  const escape   = () => { goto('/'); onEnd(); } // Return to menu, trigger on 'esc'
  const getfocus = (e) => e.focus(); // Get foucs
  
  const endCondition = () => {
    return state.over || state.stats.get().ds >= 1;
  }

  const onEnd = () => {
    // Won if: cleared 40 lines.
    win = state.stats.get().ds >= 1;

    // Format time string
    let ms = Date.now() - startTime;
    let s = Math.floor(ms / 1000);
    let m = Math.floor(s / 60);
    ms = (ms % 1000).toString().padStart(3, "0");
    s = (s % 60).toString()
    if (m != 0) s = s.padStart(2, "0");
    m = m.toString()
    time = m == 0 ? `${s}.${ms}` : `${m}:${s}.${ms}`;

    clearInterval(interval);
    state.over = true;
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
  const interval = setInterval(() => {

    state.applyInputs(game, inputs);
    state.refresh(game);

    // Workaroud for object reactivity
    state = state;

    inputs = [];

    // Check end condition
    if (endCondition()) onEnd();
  }, 1000/POLL_RATE);

</script>


<div use:getfocus tabindex="0" on:keydown={onKeyDown} on:keyup={onKeyUp}
  class="w-full h-full">
  <GameElem state={state} win={win}>

    <div slot="lose" class="mx-auto relative mt-36 text-center text-3xl font-black tracking-widest italic">
      Game Over
    </div>

    <div slot="win" class="mx-auto relative mt-36 text-center">
      <div class="text-3xl font-black tracking-widest italic">{time}</div>
      <div class="text-md font-bold">play again with <kbd class="kbd">R</kbd></div>
    </div>
  </GameElem>
</div>
