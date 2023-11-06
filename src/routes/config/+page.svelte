<script>
  import Config from '$lib/config.js';

  let das = Config.das;
  let sdf = Config.sdf;
  let error = undefined;

  const set = () => {
    if (das < 20 || das > 200) {
      error = `invalid DAS: ${das}. Must be between 20 and 200`;
      return;
    }
    if (sdf < 1 || das > 10000) {
      error = `invalid SDF: ${sdf}. Must be between 1 and 10000`;
      return;
    }
    Config.das = das;
    Config.sdf = sdf;
  }

</script>


<div class="flex flex-col items-center w-full gap-4">

  <h1 class="text-center text-4xl m-8 font-extrabold tracking-wide">Configurations</h1>

  <!-- Error Alert -->
  <div class="alert alert-error m-8 w-fit {error == undefined ? "hidden" : ""}">
    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    <span>Error: {error}</span>
  </div>

  <!-- DAS -->
  <div class="form-control w-full max-w-xs">
    <label class="label">
      <span class="label-text">DAS</span>
      <span class="label-text-alt">
        <input type="number"class="text-right w-16" bind:value={das}/>
        ms
      </span>
    </label>
    <input type="range" min="20" max="200" bind:value={das} class="range range-primary" />
  </div>


  <!-- SDF -->
  <div class="form-control w-full max-w-xs">
    <label class="label">
      <span class="label-text">SDF</span>
      
      <span class="label-text-alt">
        <input type="number"class="text-right w-16" bind:value={sdf}/>
        ticks
      </span>
    </label>
    <input type="range" min="1" max="10000" bind:value={sdf} class="range range-primary" />
  </div>

  <!-- Submit -->
  <button href="/config" class="btn w-36" on:click={set}>Set</button>
</div>
