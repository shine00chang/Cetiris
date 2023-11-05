<script>
  export let combo;
  export let b2b;

  let bump = false;
  let timeout;

  $: {
    if (combo != 0) { 
      clearTimeout(timeout);
      bump = true;

      timeout = setTimeout(() => bump = false, 200);
    }
  }
</script>

<style>
  .ani {
    transition: opacity 100ms, transform 200ms;
  }
  .bump {
    transform: scale(130%);
  }
</style>


<div class="w-full px-4 text-md font-extrabold tracking-widest">
  <div class="flex w-full ani {combo == 0 ? "opacity-0" : ""} {bump ? "bump" : ""}">
    <div class="font-semibold">COMBO</div>
    <div class="flex-grow"></div>
    <div class="text-right">x{combo}</div>
  </div>
  <div class="flex w-full ani {b2b == 0 ? "opacity-0" : ""} {bump ? "bump" : ""}">
    <div class="font-semibold">B2B</div>
    <div class="flex-grow"></div>
    <div class="text-right">x{b2b}</div>
  </div>
</div>
