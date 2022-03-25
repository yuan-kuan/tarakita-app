<script>
  import { HomeStores } from 'app/stores';

  const { venues, goToVenues, downloadingQuestion } = HomeStores;
</script>

<div class="flex min-h-screen flex-col">
  <section class="bg-primary p-8">
    <h1 class="text-2xl text-white">Where are you?</h1>
  </section>

  <section class="flex grow flex-col items-center pt-20">
    {#each $venues as venue, index}
      <button class="topic-btn" on:click={$goToVenues[index]}>{venue}</button>
    {/each}

    {#if $downloadingQuestion}
      <span class="px-6"> Downloading new questions... </span>
    {/if}
  </section>
</div>

<div
  class="fixed bottom-14 left-1/2 mx-auto inline-flex w-5/6  -translate-x-1/2 transform items-center justify-between "
>
  <button class="focus:outline-none rounded-full bg-black font-bold text-white">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-14 w-14"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
        clip-rule="evenodd"
      />
    </svg>
  </button>

  <span />
</div>
