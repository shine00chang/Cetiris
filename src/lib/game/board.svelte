<script>
  import PieceBlock from "./pieceBlock.svelte";
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

  let blocks_master = new Array(300);
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
    let cells = Array.from({length: 30}, () => new Array(10).fill(undefined));
    for (const block of board_blocks) 
      if (block.y >= 0 && block.y < 30 && block.x >= 0 && block.x < 10) 
        cells[block.y][block.x] = block;

    for (let y=0; y<20; y++) {
      for (let x=0; x<10; x++) {
        // If not in board_blocks
        if (cells[y][x] == undefined && state.board.occupied(x, y))
        {

          if (block_bank.length == 0) {
            console.error("block bank ran empty ???");
            continue;
          }
          // Take from bank, set data, add to board_blocks
          const block = block_bank.shift();

          block.inBank = false;
          block.x = x;
          block.y = y;
          block.type = state.board.board[y][x];

          // Check if the cell below is occupied, if so, set it's highlight to false;
          if (y != 0 && cells[y-1][x] != undefined) {
            cells[y-1][x].highlight = false;
          }

          // Check if the cell above is occupied, if so, set self highlight to false;
          block.highlight = !state.board.occupied(x, y+1);

          board_blocks.push(block);
        }
      }
    }
  }
</script>
<div class="relative" style="overflow: hidden">
  <!-- Game over Overlay -->
  <div class="absolute z-[40] bg-stone-400 {state.over ? "opacity-70" : "opacity-0" }"
       style="height: {S*20}px; width: {S*10}px; transition: all 400ms;"></div>

  <div class="absolute z-[40] {state.over ? "opacity-100" : "opacity-0" }"
       style="width: {S*10}px; transition: all 400ms">
    <slot name="gameover" />
  </div>

  <!-- Grid --> 
  <div style="height: {S*20}px; width: {S*10}px; background: #e9e6e3;">

    <!-- Ghost: Put ahead of "Piece" to be rendered behind-->
    <div style="position: relative">
      {#each ghost_blocks as block}
        <PieceBlock ghost={true} {...block}/>
      {/each}
    </div>

    <!-- Piece -->
    <div style="position: relative">
      {#each piece_blocks as block}
        <PieceBlock {...block}/>
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
