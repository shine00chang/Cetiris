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

  const restart  = () => document.location.reload(); // Reload page, trigger on 'r'
  const escape   = () => goto('/'); // Return to menu, trigger on 'esc'
  const getfocus = (e) => e.focus(); // Get foucs
  
  const endCondition = () => {
    if (state.stats.get().ds >= 40) {

      // Set win: this tells <GameElem> to display the win screen, not the gameover screen
      win = true;

      // Format time string
      const ms = Date.now() - startTime;
      const s = Math.floor(ms / 1000);
      const m = Math.floor(s / 60);
      time = m == 0 ? `${s %60}.${ms %1000}` : `${m}:${s %60}.${ms %1000}`;

      return true;
    } else {
      return false;
    }
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

    // If over, stop interval
    if (state.over) {
      clearInterval(interval);
      return;
    }

    state.applyInputs(inputs);
    state.refresh(game);

    // Workaroud for object reactivity
    state = state;

    inputs = [];

    // Check end condition
    if (endCondition()) {
      state.over = true;
    }
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
