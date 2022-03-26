<script>
  import { onDestroy } from 'svelte';
  import { AnsweringStores, OptionStores } from 'app/stores';

  const { comment, submitComment } = AnsweringStores;
  const { ancestors, backToParent } = OptionStores:

  let title, subtitle, topic;
  const unsubAncestors = ancestors.subscribe((values) => {
    title = undefined;
    subtitle = undefined;
    topic = undefined;

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


  let positive = '';
  let negative = '';

  const submit = (e) => {
    $submitComment(positive, negative);
  };

  onDestroy(unsubAncestors);
</script>

<div class="flex min-h-screen flex-col">
  <header class="flex flex-row bg-primary p-4">
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
  </header>
  
<section class="container p-4">
  <div class="flex h-24 items-end px-4 py-5">
    <span class="text-xl font-semibold">{topic}</span>
  </div>

  <h2 class="h-28 px-4 pb-4 text-lg">Comments:</h2>

  <div>
    <h3>Positive</h3>

    <div class="mx-auto w-full max-w-sm">
      <textarea
        class="focus:outline-none h-24 w-full resize-none overflow-hidden rounded-xl border p-2 text-black ring-1 ring-transparent transition duration-300 ease-in-out focus:border-blue-500 focus:ring-blue-500"
        placeholder="What are the good thing . . ."
        bind:value={positive}
      />
    </div>

    <div>
      <h3>Negative:</h3>

      <div class="mx-auto w-full max-w-sm">
        <textarea
          class="focus:outline-none h-24 w-full resize-none overflow-hidden rounded-xl border p-2 text-black ring-1 ring-transparent transition duration-300 ease-in-out focus:border-blue-500 focus:ring-blue-500"
          placeholder="What needs improvement. . ."
          bind:value={negative}
        />

        <div class="flex justify-end">
          <button
            class="rounded-full bg-black py-1 px-2 text-white"
            on:click={submit}>Comment</button
          >
        </div>
      </div>
    </div>
  </div>
</section>
</div>
