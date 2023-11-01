<script>
  import { POLL_RATE } from '$lib/config.js';
  import Board from '$lib/board.svelte';
  import State from '$lib/engine.js';

  import { onMount } from 'svelte';
  
  let inputElem;
  let state = new State();
  let inputs = [];

  // Keydown Event
  const onKeyDown = (e) => {
    inputs.push(e.key);
  }
  // Keyup Event - only for DAS
  const onKeyUp = (e) => {
    if (e.key == "ArrowLeft" || e.key == "ArrowRight") {
      inputs.push("das-up");
    }
  }

  function getfocus (el) {
    el.focus()
  }

  // Refreshing
  setInterval(() => {
    state.applyInputs(inputs);

    // Workaroud for object reactivity
    state = state;

    inputs = [];
  }, 1000/POLL_RATE);

</script>
<div use:getfocus tabindex="0" on:keydown={onKeyDown} on:keyup={onKeyUp}
  class="w-full h-full">
  <Board state={state} />
</div>
