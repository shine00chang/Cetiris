<svelte:options accessors />

<script>
  export let x = 0;
  export let y = 0;
  export let inBank = true;
  export let ghost = false;

  const S = 30;
  const GHOST_COLOR = "#eee";

</script>

<style>
  .block {
    z-index: 10;
    width: 30px;
    height: 30px;
    background: #333;
    position: absolute;
    transition: top 100ms, opacity 500ms;
  }

  .block.fading {
    transition: top 100ms, opacity 500ms, left 500ms;
  }

  .block.shadow {
    z-index: 0;
    background: #888;
    margin-top: 5px;
    margin-left: 5px;
  }
</style>

<div
  class="block {inBank ? "fading" : ""}"
  style="left: {inBank ? 20*S : x*S}px; top: {(19-y)*S}px; 
         background: {ghost ? GHOST_COLOR : "#333"};
         opacity: {inBank ? 0 : 1};">
</div>

<div 
  class="block shadow"
  style="left: {inBank ? 20*S : x*S}px; top: {(19-y)*S}px; opacity: {inBank ? 0 : 1};">
</div>
