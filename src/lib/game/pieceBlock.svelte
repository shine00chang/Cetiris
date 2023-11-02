<script>
  import { S, GHOST_COLOR, SHADOW_COLOR, COLORS } from './displayConfigs.js';
  export let x;
  export let y;
  export let type = "#";
  export let ghost = false;
</script>

<style>
  .block {
    z-index: 10;
    width: 30px;
    height: 30px;
    position: absolute;
    transition: all 100ms;
  }

  .block.shadow {
    z-index: 0;
    margin-top: 5px;
    margin-left: 5px;
  }
</style>

<div
  id="b-{x}-{y}"
  class="block"
  style="left: {x*S}px; top: {(19-y)*S}px; background: {ghost ? GHOST_COLOR : COLORS[type]};">
</div>

<!-- Shadow -->
{#if !ghost}
  <div 
    class="block shadow"
    style="left: {x*S}px; top: {(19-y)*S}px; background: {SHADOW_COLOR}">
  </div>
{/if}
