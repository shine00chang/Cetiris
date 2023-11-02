<svelte:options accessors />

<script>
  import { S, GHOST_COLOR, SHADOW_COLOR, COLORS } from './displayConfigs.js';

  export let x = 0;
  export let y = 0;
  export let type = "#";
  export let inBank = true;
</script>

<style>
  .block {
    z-index: 10;
    width: 30px;
    height: 30px;
    position: absolute;
    transition: top 100ms, opacity 500ms;
  }

  .block.fading {
    transition: top 100ms, opacity 500ms, left 1000ms;
  }

  .block.shadow {
    z-index: 0;
    margin-top: 5px;
    margin-left: 5px;
  }
</style>

<div
  class="block {inBank ? "fading" : ""}"
  style="left: {inBank ? 20*S : x*S}px; top: {(19-y)*S}px; 
         background: {COLORS[type]};
         opacity: {inBank ? 0 : 1};">
</div>

<div 
  class="block shadow"
  style="left: {inBank ? 20*S : x*S}px; top: {(19-y)*S}px;
         opacity: {inBank ? 0 : 1};
         background: {SHADOW_COLOR};">
</div>
