<script>
  import {OptionStores} from 'app/stores';

  const {ancestors, options, goToOptions} = OptionStores;
</script>

<section class="p-2 bg-blue-300">
  {#each $ancestors as ancestor}
  	<button>{ancestor}</button>
  {/each}
</section>

<section class="p-4 container">
  <ul>
    {#each $options as option, index}
    <li class="m-4">
      	<button
				  class="bg-blue-500 hover:bg-blue-dark text-white font-bold py-2 px-6 w-full rounded"
        	on:click={$goToOptions[index]}>{option}</button>
    </li>
    {/each}
  </ul>
</section>


