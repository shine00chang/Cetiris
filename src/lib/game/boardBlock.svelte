<svelte:options accessors />

<script>
  import { S, GHOST_COLOR, SHADOW_COLOR, COLORS } from './displayConfigs.js';

  export let x = 0;
  export let y = 0;
  export let type = "#";
  export let inBank = true;
  export let highlight = false;
</script>

<style>
  .block {
    z-index: 4;
    width: 30px;
    height: 30px;
    position: absolute;
    transition: top 100ms, opacity 500ms;
  }

  .block.fading {
    transition: top 100ms, opacity 500ms, left 1000ms;
  }

  .block.highlight {
    z-index: 2;
    height: 5px;
    filter: brightness(140%);
  }

  .block.shadow {
    z-index: 0;
    opacity: 0.7;
    margin-top: 5px;
    margin-left: 5px;
  }
</style>

{#if highlight}
<div
  class="block highlight {inBank ? "fading" : ""}"
  style="left: {inBank ? 20*S : x*S}px; top: {(19-y)*S-5}px; 
         background: {COLORS[type]};
         {inBank? "opacity: 0;" : ""}">
</div>
{/if}

<div
  class="block {inBank ? "fading" : ""}"
  style="left: {inBank ? 20*S : x*S}px; top: {(19-y)*S}px; 
         background: {COLORS[type]};
         {inBank? "opacity: 0;" : ""}">
</div>

<div 
  class="block shadow {inBank ? "fading" : ""}"
  style="left: {inBank ? 20*S : x*S}px; top: {(19-y)*S}px;
         {inBank ? "opacity: 0;" : ""}
         background: {SHADOW_COLOR};">
</div>
