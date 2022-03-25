<script>
  import { onDestroy } from 'svelte';
  import { OptionStores } from 'app/stores';

  const { ancestors, options, goToOptions, backToParent, currentName } =
    OptionStores;

  let title, subtitle, topic;

  const unsub = ancestors.subscribe((values) => {
    title = undefined;
    subtitle = undefined;
    topic = undefined;

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

<div class="flex min-h-screen flex-col">
  <section class="flex flex-row bg-primary p-4">
    <button on:click={$backToParent}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-10 w-10 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>

    {#if subtitle}
      <div class="flex flex-col h-14">
        <span class="text-3xl font-bold text-white">{title}</span>
        <span class="text-xl text-white">{subtitle}</span>
      </div>
    {:else}
      <div class="flex flex-col h-14">
        <span class="text-white text-3xl font-bold ">{title}</span>
      </div>
    {/if}
  </section>

  {#if topic}
    <h3>{topic}</h3>
  {/if}
  <section class="flex grow flex-col items-center pt-20">
    {#each $options as option, index}
      <button class="topic-btn my-2" on:click={$goToOptions[index]}>{option}</button>
    {/each}
  </section>
</div>
