<script>
  import { beforeUpdate, onDestroy } from 'svelte';
  import { OptionStores, ResultStores } from 'app/stores';

  const { backToParent, currentName } = OptionStores;
  const { ratio, upload, silentUpload, score } = ResultStores;

  $: completed = $ratio.answered == $ratio.total;

  let timeoutId;
  let uploaded = false;
  const silentUploadRun = () => {
    $silentUpload();
    uploaded = true;
  };

  const manualUplad = () => {
    if (uploaded) {
      backToParent();
    } else {
      clearTimeout(timeoutId);
      $upload();
    }
  };

  beforeUpdate(() => {
    if (completed && timeoutId == undefined) {
      timeoutId = setTimeout(silentUploadRun, 3000);
    }
  });

  onDestroy(() => {
    clearTimeout(timeoutId);
  });
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

    {#if $currentName}
      <div class="flex h-14 flex-col">
        <span class="text-3xl font-bold text-white ">{$currentName}</span>
      </div>
    {/if}
  </section>

  <section class="flex flex-col items-center px-4">
    {#if completed}
      <p class="p-4 text-center text-lg">
        The review is compeleted with a total score of
      </p>
      <p class="p-4 text-center text-3xl font-bold text-asPrimary">{$score}</p>

      <button class="topic-btn my-4" on:click={$upload}>Submit Review</button>
    {:else}
      <p class="text-lg text-center p-4">The review is incomplete</p>
      <p class="text-xl text-asPrimary text-center font-bold p-4">
        Progress: {$ratio.answered} / {$ratio.total}
      </p>

      <button class="topic-btn-done my-4" on:click={$upload}
        >Submit INCOMPLETE Review</button
      >
    {/if}
  </section>
</div>
