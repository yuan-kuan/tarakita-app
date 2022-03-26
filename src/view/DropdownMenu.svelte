<script>
  export let actions;

  let expanded = false;
  const toggle = () => {
    expanded = !expanded;
  };
</script>

<div class="relative">
  <button
    class="focus:outline-none rounded-full font-bold text-white"
    on:click={toggle}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-8 w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </button>

  {#if expanded}
    <div class="fixed bottom-0 right-0 h-screen w-screen" on:click={toggle} />

    <div class="absolute right-0 ml-2 rounded-lg bg-white p-2 shadow-lg">
      <!-- transition:slide={{ delay: 0, duration: 500, easing: circInOut }} -->
      {#each actions as action}
        <button
          class="rounded-lg bg-red-500 py-2 px-6 text-white"
          on:click={action.action}
          on:click={toggle}>{action.label}</button
        >
      {/each}
    </div>
  {/if}
</div>
