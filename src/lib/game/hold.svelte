<script>
  import Block from './block.svelte';

  import { Piece } from '../engine.js'
  const S = 20;


  export let hold;

  let blocks = [];

  // Get piece blocks from state.queue[0] and placement
  $: {
    if (hold != undefined) {
      blocks = Piece.basic(hold).map(block => {
        return {
          x: block.x + 1,
          y: 1 - block.y,
          type: hold 
        } 
      });
    }
  }
</script>

<div class="flex flex-col items-center mt-12">
  <div class="text-center text-2xl font-extrabold tracking-widest">Hold</div>
  <div
    class="bg-[#e9e6e3] rounded-xl"
    style="width: {6*S}px; height: {4*S}px; padding: {S}px;">
    <!-- Piece -->
    <div style="position: relative">
      {#each blocks as block}
        <Block S={S} {...block}/>
      {/each}
    </div>
  </div>
</div>
