<script>
  import "../app.css";

  import { fly } from 'svelte/transition';

  export let data;

  $: onMainPage = data.pathname == "/";
</script>

<div style="transition: 500ms all ease-in-out" 
     class="mx-10 {onMainPage ?
     "pt-10 " :
     "pt-2 "}">

  <a href="/" style="transition: 500ms all ease-in-out; {onMainPage ? 
      "font-size: 6rem" : 
      "font-size: 3rem"}"
      class="tracking-wider font-bold">
    Cetiris
  </a>

  <p style="transition: 500ms all ease-in-out; {onMainPage ? 
      "font-size: 1rem; top: 0px" : 
      "font-size: 1rem; top: -1rem"}" 
     class="relative tracking-wide italic text-stone-600 {onMainPage ? 
     "mb-8" : 
     "ml-2 mb-2"}">
    'Four' in croatian
  </p>
</div>

<hr style="transition: 500ms all ease-in-out; {onMainPage ? 
    "opacity: 0" : 
    "opacity: 1"}">

<div class="mx-10">
{#key data.pathname}
  <div out:fly={{ y: 500, duration: 500 }} in:fly={{ y: 500, duration: 500, delay: 500 }}>
    <slot/>
  </div>
{/key}
</div>
