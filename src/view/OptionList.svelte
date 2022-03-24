<script>
  import { onDestroy } from 'svelte';
  import {OptionStores} from 'app/stores';

  const {ancestors, options, goToOptions, backToParent, currentName} = OptionStores;

  let title, subtitle, topic;
  
  const unsub = ancestors.subscribe((values) => {
    values.push($currentName);
		if (values.length >= 1) {
		 title = values[0];
		}
		if (values.length >= 2) {
		 subtitle = values[1];
		}
		if (values.length >= 3) {
		 topic = values[2];
		}
	});

	onDestroy(unsub);	
</script>

<section class="p-2 bg-blue-300">
  <button on:click={$backToParent}>back</button>
  {#if title}
    <h1>{title}</h1>
  {/if}
  {#if subtitle}
    <h2>{subtitle}</h2>
  {/if}
  {#if topic}
    <h3>{topic}</h3>
  {/if}
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


