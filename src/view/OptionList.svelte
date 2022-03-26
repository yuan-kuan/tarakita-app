<script>
  import * as R from 'ramda';
  import { onDestroy } from 'svelte';
  import { OptionStores, ResultStores } from 'app/stores';

  const {
    ancestors,
    options,
    isCompleted,
    goToOptions,
    backToParent,
    currentName,
    goToResult,
  } = OptionStores;
  const { ratio } = ResultStores;

  let title, subtitle, topic;
  let isVenue = false;

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

    if (values.length == 1) {
      isVenue = true;
    } else {
      isVenue = false;
    }
  });

  $: allCompleted = R.all(R.equals(true), $isCompleted);

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
      <div class="flex h-14 flex-col">
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
      {#if $isCompleted[index]}
        <button class="topic-btn-done my-2" on:click={$goToOptions[index]}>
          <div class="flex flex-row justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg> <span>{option}</span>
          </div>
        </button>
      {:else}
        <button class="topic-btn my-2" on:click={$goToOptions[index]}
          >{option}</button
        >
      {/if}
    {/each}

    {#if isVenue}
      {#if allCompleted}
        <button class="topic-btn my-2" on:click={$goToResult}
          >View Result</button
        >
      {:else}
        <button class="topic-btn-done my-2" on:click={$goToResult}
          >View Progress</button
        >
      {/if}
    {/if}
  </section>
</div>
