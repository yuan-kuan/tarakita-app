<script>
  import {OptionStores} from 'app/stores';

  const {ancestors, options, goToOptions} = OptionStores;
</script>

<div>
  {#each $ancestors as ancestor}
  	<button>{ancestor}</button>
  {/each}
</div>

<div>
  <h2>List goes here</h2>
  <ul>
    {#each $options as option, index}
    	<button on:click={$goToOptions[index]}>{option}</button>
    {/each}
  </ul>
</div>


