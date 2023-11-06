<script>
  import GameElem from '$lib/game/game.svelte';

  import { POLL_RATE } from '$lib/config.js';
  import { State, Game } from '$lib/engine.js';
  
  let game = new Game();
  let state = new State();
  let inputs = [];

  // Get foucs
  const getfocus = (e) => e.focus();

  // Keydown Event
  const onKeyDown = (e) => {
    e.preventDefault();
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
  }, 1000/POLL_RATE);

</script>
<div use:getfocus tabindex="0" on:keydown={onKeyDown} on:keyup={onKeyUp}
  class="w-full h-full">
  <GameElem state={state} />
</div>
