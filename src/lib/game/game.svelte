<script>
  import Board from './board.svelte';
  import Queue from './queue.svelte';
  import Hold from './hold.svelte';

  export let state;

</script>


<!-- Grid --> 
<div class="w-fit flex flex-row gap-8 rounded-3xl p-6 bg-stone-300 border-r-8 border-b-8 border-[#888]">
  <Hold hold={ state.hold }/>
  <Board { state }/>
  <Queue queue={ state.queue } />
</div>
