<script>
  import { S as standardS, GHOST_COLOR, SHADOW_COLOR, COLORS } from './displayConfigs.js';

  export let S = standardS;
  export let x;
  export let y;
  export let type = "#";
</script>

<style>
  .block {
    transition: all 100ms;
  }
</style>

<div
  class="block z-10 absolute"
  style="width: {S}px; height: {S}px; left: {x*S}px; top: {y*S}px; background: {COLORS[type]};">
</div>

<!-- Shadow -->
<div 
  class="block z-0 absolute"
  style="margin-top: {S/6}px; margin-left: {S/6}px; width: {S}px; height: {S}px;
         left: {x*S}px; top: {y*S}px; background: {SHADOW_COLOR};">
</div>
