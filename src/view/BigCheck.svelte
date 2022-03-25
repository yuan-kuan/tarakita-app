<script>
  export let main = false;
  export let value;
  export let title;
</script>

<div class="mb-4">
  <label class="flex items-center justify-start">
    {#if main}
      <div class="select-none pr-4 text-lg font-bold text-white">{title}</div>
      <div
        class="mr-2 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-400 bg-white focus-within:border-blue-500"
      >
        <input
          type="checkbox"
          class="absolute opacity-0"
          bind:checked={value}
        />
        <svg
          class="pointer-events-none hidden h-6 w-6 fill-current text-asPrimary"
          viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" /></svg
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
          class="pointer-events-none hidden h-5 w-5 fill-current text-asPrimary"
          viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" /></svg
        >
      </div>
      <div class="select-none text-lg text-white">{title}</div>
    {/if}
  </label>
</div>

<style>
  input:checked + svg {
    display: block;
  }
</style>
