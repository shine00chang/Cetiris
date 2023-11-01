<script>
  export let block;
  export let S;
  export let ghost = false;

  const GHOST_COLOR = "#eee";
</script>

<style>
  .block {
    z-index: 10;
    width: 30px;
    height: 30px;
    background: #333;
    position: absolute;
    transition: all 100ms;
  }

  .block.shadow {
    z-index: 0;
    background: #888;
    margin-top: 5px;
    margin-left: 5px;
  }
</style>

<div
  id="b-{block.x}-{block.y}"
  class="block"
  style="left: {block.x*S}px; top: {(19-block.y)*S}px; {ghost ? `background: ${GHOST_COLOR};` : ""}">
</div>

<!-- Shadow -->
{#if !ghost}
  <div 
    class="block shadow"
    style="left: {block.x*S}px; top: {(19-block.y)*S}px">
  </div>
{/if}
