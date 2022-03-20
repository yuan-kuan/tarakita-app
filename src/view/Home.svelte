<script>
  import {HomeStores} from 'app/stores';

  const {venues, goToVenues} = HomeStores;
</script>

<h1>Home</h1>

<div>
  <h2>Venues</h2>
  <ul>
    {#each $venues as venue, index}
    	<button on:click={$goToVenues[index]}>{venue}</button>
    {/each}
  </ul>
</div>
