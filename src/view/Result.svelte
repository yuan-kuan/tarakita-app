<script>
  import { onDestroy } from 'svelte';
  import { OptionStores, ResultStores } from 'app/stores';

  const { ancestors, backToParent } = OptionStores;
  const { ratio, upload, score } = ResultStores;

  let title;

  const unsub = ancestors.subscribe((values) => {
    title = undefined;
    if (values.length >= 1) {
      title = values[0];
    }
  });

  let completed = $ratio.answered == $ratio.total;

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

    {#if title}
      <div class="flex h-14 flex-col">
        <span class="text-3xl font-bold text-white ">{title}</span>
      </div>
    {/if}
  </section>

  {#if completed}
    <p>The review is compeleted with a total score of</p>
    <p>{$score}</p>

    <button class="btn">Upload Review</button>
  {:else}
    <p>The review is incomplete</p>
    <p>Progress: {$ratio.answered} / {$ratio.total}</p>

    <button class="btn">Upload INCOMPLETE Review</button>
  {/if}
</div>
