<script>
  import { S as standardS, GHOST_COLOR, SHADOW_COLOR, COLORS } from './displayConfigs.js';

  export let S = standardS;
  export let x;
  export let y;
  export let type = "#";
</script>

<style>
  .block {
    position: absolute;
    transition: all 100ms;
  }
  .highlight {
    filter: brightness(140%);
  }
</style>

<!-- Highlight -->
<div
  class="block highlight absolute"
  style="left: {x*S}px; top: {y*S - S/6}px;
         width: {S}px;
         height: {S/6}px;
         background: {COLORS[type]};
         z-index: {100-y}">
</div>


<div
  class="block absolute"
  style="width: {S}px; height: {S}px; left: {x*S}px; top: {y*S}px; background: {COLORS[type]}; z-index: {100-y}">
</div>

<!-- Shadow -->
<div 
  class="block z-0 absolute"
  style="margin-top: {S/6}px; margin-left: {S/6}px; width: {S}px; height: {S}px;
         left: {x*S}px; top: {y*S}px; background: {SHADOW_COLOR};">
</div>
