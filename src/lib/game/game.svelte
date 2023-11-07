<script>
  import Board from './board.svelte';
  import Queue from './queue.svelte';
  import Hold from './hold.svelte';
  import Combo from './combo.svelte';
  import Stats from './stats.svelte';

  export let state;
  export let win;

  let stats;

  $: stats = state.stats.get();
</script>


<!-- Grid --> 
<div class="w-fit flex flex-row gap-8 rounded-3xl p-6 bg-stone-300 border-r-8 border-b-8 border-[#888]">
  <div class="flex flex-col items-center gap-8">
    <Hold hold={ state.hold }/>
    <Combo combo={state.combo} b2b={state.b2b} />
    <Stats {...stats}/>
  </div>
  <Board { state }>
    <div slot="gameover">
      {#if win}
        <slot name="win" />
      {:else} 
        <slot name="lose" />
      {/if}
    </div>
  </Board>
  <Queue queue={ state.queue } />
</div>
