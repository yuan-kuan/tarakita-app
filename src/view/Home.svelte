<script>
  import { HomeStores } from 'app/stores';

  const { venues, goToVenues, downloadingQuestion } = HomeStores;
</script>

<section class="bg-blue-300 p-8">
  <h1 class="text-2xl">Access Audit</h1>
  <h6 class="text-base">TaraKita</h6>
</section>

<section class="container p-4">
  <ul>
    {#each $venues as venue, index}
      <li class="m-4">
        <button
          class="hover:bg-blue-dark w-full rounded bg-blue-500 py-2 px-6 font-bold text-white"
          on:click={$goToVenues[index]}>{venue}</button
        >
      </li>
    {/each}

    {#if $downloadingQuestion}
      <li>
        <span class="w-full px-6"> Downloading new questions... </span>
      </li>
    {/if}
  </ul>
</section>
