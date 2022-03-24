<script>
  export let main = false;
  export let value;
  export let title;
</script>

<div class="mb-4">
  <label class="flex items-start justify-start">
    {#if main}
      <div class="select-none text-lg font-bold">{title}</div>
      <div
        class="mr-2 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-400 bg-white focus-within:border-blue-500"
      >
        <input
          type="checkbox"
          class="absolute opacity-0"
          bind:checked={value}
        />
        <svg
          class="pointer-events-none hidden h-7 w-7 fill-current text-green-500"
          viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z" /></svg
        >
      </div>
    {:else}
      <div
        class="bg-white border-2 rounded-full border-gray-400 w-8 h-8 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500"
      >
        <input
          type="checkbox"
          class="opacity-0 absolute"
          bind:checked={value}
        />
        <svg
          class="fill-current hidden w-6 h-6 text-green-500 pointer-events-none"
          viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z" /></svg
        >
      </div>
      <div class="select-none text-lg">{title}</div>
    {/if}
  </label>
</div>

<style>
  input:checked + svg {
    display: block;
  }
</style>
