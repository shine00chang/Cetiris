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
    position: absolute;
    transition: top 100ms, opacity 500ms;
  }

  .block.fading {
    transition: top 100ms, opacity 500ms, left 1000ms;
  }

  .block.highlight {
    filter: brightness(140%);
  }

</style>

{#if highlight}
<div
  class="block z-[2] highlight {inBank ? "fading opacity-0" : ""}"
  style="width: {S}px; height: {S/6}px;
         left: {inBank ? 20*S : x*S}px; top: {(19-y)*S- S/6}px; 
         background: {COLORS[type]};">
</div>
{/if}

<div
  class="block z-[4] {inBank ? "fading opacity-0" : ""}"
  style="width: {S}px; height: {S}px;
         left: {inBank ? 20*S : x*S}px; top: {(19-y)*S}px; 
         background: {COLORS[type]};">
</div>

<div 
  class="block z-0 {inBank ? "fading opacity-0" : "opacity-70"}"
  style="width: {S}px; height: {S}px;
         margin-top: {S/6}px; margin-left: {S/6}px;
         left: {inBank ? 20*S : x*S}px; top: {(19-y)*S}px;
         background: {SHADOW_COLOR};">
</div>
