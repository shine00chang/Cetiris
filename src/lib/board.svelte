<script>
  import Block from "./block.svelte";
  import BoardBlock from "./boardBlock.svelte";
  import { onMount } from "svelte";

  export let state;

  const S = 30;
  let current_piece;
  let piece_blocks = [];
  let ghost_blocks = [];

  // Get piece blocks from state.queue[0] and placement
  $: {
    let type = state.queue[0];
    let move = state.move;

    piece_blocks = move.cells(type);
  }
  // Get ghost blocks from state.ghost()
  $: {
    let type = state.queue[0];
    let move = state.ghost();

    ghost_blocks = move.cells(type);
  }

  let blocks_master = new Array(200);
  let block_bank = [];
  let board_blocks = [];

  onMount(() => {
    for (let i=0; i<blocks_master.length; i++) {
      block_bank[i] = blocks_master[i];
    }
  });

  $: {
    // Shifting blocks 
    for (let i=board_blocks.length-1; i >= 0; i--) {
      const block = board_blocks[i];

      // If no shift
      if (state.dy[block.y] == 0) continue;

      // If cleared
      if (state.dy[block.y] == 'cleared') 
      {
        block.inBank = true;
        board_blocks.splice(i, 1);

        // Set timeout to remove
        setTimeout(() => {
          block_bank.push(block);
        }, 500);
        continue;
      }

      // else, shift
      block.y += state.dy[block.y];
    }

    // Add new blocks
    // precompute all occupied cells. 
    let occupied = Array.from({length: 20}, () => new Array(10).fill(false));
    for (const block of board_blocks) 
      if (block.y >= 0 && block.y < 30 && block.x >= 0 && block.x < 10) 
        occupied[block.y][block.x] = true;

    for (let y=0; y<20; y++) {
      for (let x=0; x<10; x++) {
        // If not in board_blocks
        if (!occupied[y][x] && state.board.occupied(x, y))
        {
          // Take from bank, set data, add to board_blocks
          const block = block_bank.shift();

          block.inBank = false;
          block.x = x;
          block.y = y;
          board_blocks.push(block);
        }
      }
    }
  }
</script>

<style>
</style>


<!-- Grid --> 
<div class="w-fit rounded-3xl px-16 py-6 bg-stone-300 border-r-8 border-b-8 border-[#888]">
  <div class="bg-stone-400" style="height: {S*20}px; width: {S*10}px">
    <!-- Piece -->
    <div style="position: relative">
      {#each piece_blocks as block}
        <Block {block} {S}/>
      {/each}
    </div>

    <!-- Ghost -->
    <div style="position: relative">
      {#each ghost_blocks as block}
        <Block ghost={true} {block} {S}/>
      {/each}
    </div>

    <!-- Board -->
    <div style="position: relative">
      {#each blocks_master as block} 
        <BoardBlock bind:this={block}/>
      {/each}
    </div>
  </div>
</div>

