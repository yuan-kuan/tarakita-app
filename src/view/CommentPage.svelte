<script>
  import { onDestroy } from 'svelte';
  import { AnsweringStores, OptionStores } from 'app/stores';

  const { comment, submitComment } = AnsweringStores;
  const { ancestors, backToParent, currentName } = OptionStores;

  let title, subtitle, topic;
  const unsubAncestors = ancestors.subscribe((values) => {
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

    <h2 class="px-4 pb-2 text-lg">Comments (Optional):</h2>

    <div class="px-4">
      <h3 class="text-lg text-asPrimary">Positive</h3>

      <div class="mx-auto w-full max-w-sm">
        <textarea
          class="focus:outline-none h-28 w-full resize-none overflow-hidden rounded-lg border-2 border-primary p-2 text-black ring-1 ring-transparent transition duration-300 ease-in-out focus:border-blue-500 focus:ring-blue-500"
          placeholder="What are the good thing . . ."
          bind:value={positive}
        />
      </div>

      <div>
        <h3 class="text-lg text-asPrimary">Negative</h3>

        <div class="mx-auto w-full max-w-sm">
          <textarea
            class="focus:outline-none h-28 w-full resize-none overflow-hidden rounded-lg border-2 border-primary p-2 text-black ring-1 ring-transparent transition duration-300 ease-in-out focus:border-blue-500 focus:ring-blue-500"
            placeholder="What needs improvement. . ."
            bind:value={negative}
          />
        </div>
      </div>
    </div>
  </section>

  <div
    class="fixed bottom-4 left-1/2 mx-auto inline-flex h-20 w-5/6  -translate-x-1/2 transform items-center justify-between "
  >
    <button
      class="focus:outline-none rounded-full bg-black font-bold text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-14 w-14"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <button
      class="focus:outline-none rounded-full bg-white font-bold text-asPrimary"
      on:click={submit}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</div>
