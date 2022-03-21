<script>
  import {AnsweringStores} from 'app/stores';

  const {question, hasNext, goToNext} = AnsweringStores;
</script>

<section class="p-4 container">
  <h2 class="px-4 py-6 text-lg">{$question}</h2>
  
  	<button
		  class="bg-blue-500 hover:bg-blue-dark text-white font-bold py-2 px-6 rounded"
    	>1</button>
  	<button
		  class="bg-blue-500 hover:bg-blue-dark text-white font-bold py-2 px-6 rounded"
    	>2</button>
  	<button
		  class="bg-blue-500 hover:bg-blue-dark text-white font-bold py-2 px-6 rounded"
    	>3</button>
  	<button
		  class="bg-blue-500 hover:bg-blue-dark text-white font-bold py-2 px-6 rounded"
    	>4</button>
</section>


<section class="p-4 container">
  {#if $hasNext}
  	<button
		  class="bg-blue-500 hover:bg-blue-dark text-white font-bold py-2 px-6 rounded"
		  on:click={$goToNext}
    	>Next Question</button>
  {:else}
   	<button
		  class="bg-blue-500 hover:bg-blue-dark text-white font-bold py-2 px-6 rounded"
    	>Back </button>
  {/if}
</section>

