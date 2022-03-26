<script>
  import { fade } from 'svelte/transition';
</script>

<div
  class="fixed top-0 left-0 z-30 flex h-screen w-screen items-center justify-center bg-gray-900 bg-opacity-50"
  on:click
>
  <div
    id="content"
    class="relative mx-8 my-12 overflow-auto rounded-3xl"
    transition:fade={{ duration: 500 }}
    on:click|stopPropagation={() => {}}
  >
    <slot />
  </div>
  <button class="absolute top-2 right-2 text-white" on:click>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-10 w-10"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  </button>
</div>

<style>
  #content {
    max-height: 93%;
  }
</style>
