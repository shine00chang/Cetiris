<script>
  import { S, GHOST_COLOR, SHADOW_COLOR, COLORS } from './displayConfigs.js';
  export let x;
  export let y;
  export let type = "#";
  export let ghost = false;
</script>

<style>
  .ghost {
    width: 30px;
    height: 30px;
    position: absolute;
    transition: all 100ms;
    opacity: 0.7;
  }

  .block {
    width: 30px;
    height: 30px;
    position: absolute;
    transition: all 100ms;
  }

  .block.highlight {
    height: 5px;
  }

  .block.shadow {
    z-index: 1;
    margin-top: 5px;
    margin-left: 5px;
  }
</style>

<!-- Highlight -->
{#if !ghost}
  <div
    class="block highlight"
    style="left: {x*S}px; top: {(19-y)*S-5}px;
           background: {COLORS[type]}a0;
           z-index: {y+1}">
  </div>
{/if}

<div
  id="b-{x}-{y}"
  class={ghost ? "ghost" : "block"}
  style="left: {x*S}px; top: {(19-y)*S}px; 
          background: {ghost ? GHOST_COLOR : COLORS[type]}; 
          z-index: {y+1};">
</div>

<!-- Shadow -->
{#if !ghost}
  <div 
    class="block shadow"
    style="left: {x*S}px; top: {(19-y)*S}px; background: {SHADOW_COLOR}; z-index: 0;">
  </div>
{/if}
