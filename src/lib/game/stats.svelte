<script>
  export let apm;
  export let attacks;
  export let pps;
  export let pieces;
  export let vs;

  function trunc (x) {
    if (isNaN(x)) x = 0;
    return Number.parseFloat(x).toFixed(2);
  }
</script>

<div class="grid grid-cols-5 w-36 gap-1
  text-center text-md  tracking-widest">
  <div class="col-span-2 font-bold">
    <div>APM</div>
    <div>PPS</div>
    <div>VS</div>
  </div>
  <div class="col-span-2 text-right font-extrabold">
    <div>{trunc(apm)}</div>
    <div>{trunc(pps)}</div>
    <div>{trunc(vs)}</div>
  </div>
  <div class="text-left font-semibold">
    <div>/{attacks}</div>
    <div>/{pieces}</div>
  </div>
</div>
