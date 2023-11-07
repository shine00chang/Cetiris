<script>
  import Board from './board.svelte';
  import Queue from './queue.svelte';
  import Hold from './hold.svelte';
  import Combo from './combo.svelte';
  import Stats from './stats.svelte';

  export let state;
  export let win;

  let stats;
  let garbage_level;

  $: garbage_level = Math.min(20, state.garbage_queue);
  $: stats = state.stats.get();
</script>


<div class="w-fit flex flex-row gap-8 rounded-3xl p-6 bg-stone-300 border-r-8 border-b-8 border-[#888]">
  <!-- Hold & Stats -->
  <div class="flex flex-col items-center gap-8">
    <Hold hold={ state.hold }/>
    <Combo combo={state.combo} b2b={state.b2b} />
    <Stats {...stats}/>
  </div>

  <div class="flex rounded-xl overflow-hidden">

    <!-- Garbage Indicator -->
    <div class="h-full w-2 bg-secondary">
      <div class="w-full h-full bg-stone-300" style="height: {(20-garbage_level) * 5}%; transition: height 200ms"></div>
    </div>

    <!-- Board --> 
    <Board { state }>
      <div slot="gameover">
        {#if win}
          <slot name="win" />
        {:else} 
          <slot name="lose" />
        {/if}
      </div>
    </Board>
  </div>

  <!-- Preview Queue -->
  <Queue queue={ state.queue } />
</div>
