<script>
  import GameElem from '$lib/game/game.svelte';

  import { POLL_RATE } from '$lib/config.js';
  import { State, Game } from '$lib/engine.js';

  import { goto } from '$app/navigation';
  

  let game = new Game();
  let state = new State();
  let stateBot = new State();
  let inputs = [];
  let inputsBot = [];

  let startTime = undefined;
  let time = undefined;
  let win = false;

  const restart  = () => document.location.reload(); // Reload page, trigger on 'r'
  const escape   = () => goto('/'); // Return to menu, trigger on 'esc'
  const getfocus = (e) => e.focus(); // Get foucs
  
  const endCondition = () => {
    if (!state.over && !stateBot.over) return false;

    win = stateBot.over;

    // Format time string
    {
      const ms = Date.now() - startTime;
      const s = Math.floor(ms / 1000);
      const m = Math.floor(s / 60);
      time = m == 0 ? `${s %60}.${ms %1000}` : `${m}:${s %60}.${ms %1000}`;
    }

    return true;
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
  const interval = setInterval(() => {

    // If over, stop interval
    if (state.over) {
      clearInterval(interval);
      return;
    }

    state.applyInputs(inputs);
    state.refresh(game);

    stateBot.applyInputs(inputsBot);
    stateBot.refresh(game);

    // Exchange garbage
    state.applyAttacks(stateBot.attacks);
    stateBot.applyAttacks(state.attacks);
    
    // Workaroud for object reactivity
    state = state;
    stateBot = stateBot;

    inputs = [];
    inputsBot = [];

    if (endCondition()) {
      state.over = true;
      stateBot.over = true;
    }
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
