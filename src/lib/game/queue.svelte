<script>
  import Block from './block.svelte';

  import { Piece } from '../engine.js'
  const S = 20;

  export let queue;

  let blocks = [];

  // Get piece blocks from state.queue[0] and placement
  $: {
    blocks = [];
    for (let i=1; i<queue.length; i++) {
      const type = queue[i];
      blocks = blocks.concat(Piece.basic(type).map(block => {
        return {
          x: block.x + 1,
          y: i*3 - 2 - block.y,
          type,
        } 
      }));
    }
  }
</script>

<div class="mt-12">
  <div class="text-center text-2xl font-extrabold tracking-widest">Queue</div>
  <div
    class="bg-[#e9e6e3] rounded-xl"
    style="width: {6*S}px; height: {(3*5+1)*S}px; padding: {S}px;">
    <!-- Piece -->
    <div style="position: relative">
      {#each blocks as block}
        <Block S={S} {...block}/>
      {/each}
    </div>
  </div>
</div>
