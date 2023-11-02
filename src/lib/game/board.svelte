<script>
  import PieceBlock from "./pieceblock.svelte";
  import BoardBlock from "./boardBlock.svelte";
  import { onMount } from "svelte";
  import { S } from './displayConfigs.js';

  export let state;

  let piece_blocks = [];
  let ghost_blocks = [];

  // Get piece blocks from state.queue[0] and placement
  $: {
    let type = state.queue[0];
    let move = state.move;

    piece_blocks = move.cells(type).map(block => { return {...block, type } });
  }
  // Get ghost blocks from state.ghost()
  $: {
    let type = state.queue[0];
    let move = state.ghost();

    ghost_blocks = move.cells(type).map(block => { return {...block, type } });
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
    let occupied = Array.from({length: 30}, () => new Array(10).fill(false));
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
          block.type = state.board.board[y][x];
          board_blocks.push(block);
        }
      }
    }
  }
</script>

<div class="relative">
  <!-- Game over Overlay -->
  <div class="absolute z-[40] bg-stone-400 {state.over ? "opacity-70" : "opacity-0" }"
       style="height: {S*20}px; width: {S*10}px; transition: all 400ms"></div>

  <div class="absolute z-[40] {state.over ? "opacity-100" : "opacity-0" }"
       style="width: {S*10}px; transition: all 400ms">
    <div class="mx-auto relative mt-36 text-center text-3xl font-black tracking-widest italic opacity-100">
      Game Over
    </div>
  </div>

  <!-- Grid --> 
  <div class="bg-stone-400" style="height: {S*20}px; width: {S*10}px">
    <!-- Piece -->
    <div style="position: relative">
      {#each piece_blocks as block}
        <PieceBlock {...block}/>
      {/each}
    </div>

    <!-- Ghost -->
    <div style="position: relative">
      {#each ghost_blocks as block}
        <PieceBlock ghost={true} {...block}/>
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
