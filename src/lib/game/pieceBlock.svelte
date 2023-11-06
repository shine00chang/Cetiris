<script>
  import { S, GHOST_COLOR, SHADOW_COLOR, COLORS } from './displayConfigs.js';
  export let x;
  export let y;
  export let type = "#";
  export let ghost = false;
</script>

<style>
  .ghost {
    position: absolute;
    transition: all 100ms;
    opacity: 0.7;
  }

  .block {
    position: absolute;
    transition: all 100ms;
  }
</style>

<!-- Highlight -->
{#if !ghost}
  <div
    class="block highlight"
    style="width: {S}px; height: {S/6}px;
           left: {x*S}px; top: {(19-y)*S-(S/6)}px;
           background: {COLORS[type]}a0;
           z-index: {y+1}">
  </div>
{/if}

<div
  id="b-{x}-{y}"
  class={ghost ? "ghost" : "block"}
  style="width: {S}px; height: {S}px;
         left: {x*S}px; top: {(19-y)*S}px; 
         background: {ghost ? GHOST_COLOR : COLORS[type]}; 
         z-index: {y+1};">
</div>

<!-- Shadow -->
{#if !ghost}
  <div 
    class="block shadow z-0"
    style="width: {S}px; height: {S}px;
           margin-top: {S/6}px; margin-left: {S/6}px;
           left: {x*S}px; top: {(19-y)*S}px;
           background: {SHADOW_COLOR};">
  </div>
{/if}
