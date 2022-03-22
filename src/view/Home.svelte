<script>
  import {HomeStores} from 'app/stores';

  const {venues, goToVenues, downloadingQuestion} = HomeStores;
</script>

<section class="p-8 bg-blue-300">
	<h1 class="text-2xl">Access Audit</h1>
	<h6 class="text-base">TaraKita</h6>
</section>

<section class="p-4 container">
  <ul>
    {#each $venues as venue, index}
      <li class="m-4">
      	<button
				  class="bg-blue-500 hover:bg-blue-dark text-white font-bold py-2 px-6 w-full rounded"
          on:click={$goToVenues[index]}>{venue}</button>
      </li>
    {/each}

    {#if $downloadingQuestion}
			<li>
				<span class="px-6 w-full">
    			Downloading new questions...
				</span>
  		</li>
    {/if}
  </ul>
</section>
