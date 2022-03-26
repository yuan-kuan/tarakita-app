<script>
  import Modal from 'view/Modal.svelte';
  import DropdownMenu from 'view/DropdownMenu.svelte';
  import { HomeStores } from 'app/stores';

  const { venues, goToVenues, downloadingQuestion, reset } = HomeStores;

  let confirmPopup = false;
  const displayPopup = () => {
    confirmPopup = true;
  };

  const toReset = () => {
    confirmPopup = false;
    $reset();
  };
</script>

<div class="flex min-h-screen flex-col">
  <header class="flex flex-row justify-between bg-primary p-8">
    <span class="text-3xl text-white">Where are you?</span>
    <DropdownMenu
      actions={[
        {
          action: displayPopup,
          label: 'Delete Account',
        },
      ]}
    />
  </header>

  <section class="flex grow flex-col items-center pt-20">
    {#each $venues as venue, index}
      <button class="topic-btn" on:click={$goToVenues[index]}>{venue}</button>
    {/each}

    {#if $downloadingQuestion}
      <span class="px-6"> Downloading new questions... </span>
    {/if}
  </section>
</div>

<div
  class="fixed bottom-14 left-1/2 mx-auto inline-flex w-5/6  -translate-x-1/2 transform items-center justify-between "
>
  <button class="focus:outline-none rounded-full bg-black font-bold text-white">
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

  <span />
</div>

{#if confirmPopup}
  <Modal on:click={() => (confirmPopup = false)}>
    <div
      class="mx-3 flex flex-col items-center justify-center rounded-lg bg-white p-4 shadow-lg"
    >
      <p class="p-2">
        Delete the current account and start again with a new account. This will
        NOT delete any review you had submitted before.
      </p>

      <div class="flex w-full flex-row justify-between">
        <button class="btn bg-red-500 text-white" on:click={toReset}>Yes</button
        >
        <button
          class="btn border-2 border-primary bg-white text-asPrimary"
          on:click={() => (confirmPopup = false)}>No</button
        >
      </div>
    </div>
  </Modal>
{/if}
