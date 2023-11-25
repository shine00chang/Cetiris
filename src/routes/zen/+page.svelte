<script>
  import GameElem from '$lib/game/game.svelte';

  import { POLL_RATE } from '$lib/config.js';
  import { State, Game } from '$lib/engine.js';

  import { goto } from '$app/navigation';
  

  let game = new Game();
  let state = new State();
  let inputs = [];

  const restart  = () => document.location.reload(); // Reload page, trigger on 'r'
  const escape   = () => goto('/'); // Return to menu, trigger on 'esc'
  const getfocus = (e) => e.focus(); // Get foucs
  
  // Keydown Event
  const onKeyDown = (e) => {
    e.preventDefault();

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

    state.applyInputs(game, inputs);
    state.refresh(game);

    // Workaroud for object reactivity
    state = state;

    inputs = [];
  }, 1000/POLL_RATE);

</script>


<div use:getfocus tabindex="0" on:keydown={onKeyDown} on:keyup={onKeyUp}
  class="w-full h-full">
  <GameElem state={state} win={false}>
    <div slot="lose" class="mx-auto relative mt-36 text-center text-3xl font-black tracking-widest italic">
      Game Over
    </div>
  </GameElem>
</div>
