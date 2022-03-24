<script>
  import { onDestroy } from 'svelte';
  import { AnsweringStores } from 'app/stores';

  const {
    ancestors,
    question,
    hasNext,
    goToNext,
    backToParent,
    submit,
    rating,
  } = AnsweringStores;

  let yesOrNo;
  let currentRating;
  let canSubmit = false;

  const unsub = rating.subscribe((v) => {
    if (v != undefined) {
      currentRating = v;
      yesOrNo = v == 0 ? false : true;
    }
  });

  $: {
    if (yesOrNo == true && currentRating != undefined) {
      canSubmit = true;
    } else if (yesOrNo == false) {
      canSubmit = true;
    } else {
      canSubmit = false;
    }
  }

  const rateNow = (e) => {
    $submit(currentRating ?? 0);
    yesOrNo = undefined;
    currentRating = undefined;
    canSubmit = false;
  };

  onDestroy(unsub);
</script>

<section class="container p-4">
  <h2 class="px-4 py-6 text-lg">{$question}</h2>

  <div class="flex w-full">
    <div class="flex w-full justify-around">
      <div class="radio inline-block">
        <input
          name="yesOrNo"
          type="radio"
          id="yes1"
          hidden="hidden"
          bind:group={yesOrNo}
          value={true}
        />
        <label
          for="yes1"
          class="h-15 flex w-20 items-center justify-center rounded-lg px-2 py-1 text-3xl font-bold lg:h-14 lg:w-14 lg:text-5xl"
        >
          yes
        </label>
      </div>

      <div class="radio inline-block">
        <input
          name="yesOrNo"
          type="radio"
          id="no1"
          hidden="hidden"
          bind:group={yesOrNo}
          value={false}
        />
        <label
          for="no1"
          class="h-15 flex w-20 items-center justify-center rounded-lg px-2 py-1 text-3xl font-bold lg:h-14 lg:w-14 lg:text-5xl"
        >
          no
        </label>
      </div>
    </div>
  </div>

  {#if yesOrNo}
    <div>
      <label
        for="entry"
        class="mb-2 block text-sm font-semibold text-gray-700 lg:text-base"
      >
        Your Rating
      </label>
      <div class="flex flex w-full justify-around">
        <div class="radio inline-block">
          <input
            name="currentRating"
            type="radio"
            id="rate1"
            hidden="hidden"
            bind:group={currentRating}
            value={1}
          />
          <label
            for="rate1"
            class="flex h-10 w-10 items-center justify-center rounded-full px-2 py-1 text-3xl font-bold lg:h-14 lg:w-14 lg:text-5xl"
          >
            1
          </label>
        </div>

        <div class="radio inline-block">
          <input
            name="currentRating"
            type="radio"
            id="rate2"
            hidden="hidden"
            bind:group={currentRating}
            value={2}
          />
          <label
            for="rate2"
            class="flex h-10 w-10 items-center justify-center rounded-full px-2 py-1 text-3xl font-bold lg:h-14 lg:w-14 lg:text-5xl"
          >
            2
          </label>
        </div>

        <div class="radio inline-block">
          <input
            name="currentRating"
            type="radio"
            id="rate3"
            hidden="hidden"
            bind:group={currentRating}
            value={3}
          />
          <label
            for="rate3"
            class="flex h-10 w-10 items-center justify-center rounded-full px-2 py-1 text-3xl font-bold lg:h-14 lg:w-14 lg:text-5xl"
          >
            3
          </label>
        </div>

        <div class="radio inline-block">
          <input
            name="currentRating"
            type="radio"
            id="rate4"
            hidden="hidden"
            bind:group={currentRating}
            value={4}
          />
          <label
            for="rate4"
            class="flex h-10 w-10 items-center justify-center rounded-full px-2 py-1 text-3xl font-bold lg:h-14 lg:w-14 lg:text-5xl"
          >
            4
          </label>
        </div>
      </div>
    </div>
  {/if}
</section>

<section class="container p-4">
  <button
    class="hover:bg-blue-dark rounded bg-blue-500 py-2 px-6 font-bold text-white"
    on:click={$backToParent}
    >Back
  </button>
  <button
    class="hover:bg-blue-dark rounded bg-blue-500 py-2 px-6 font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-200"
    disabled={!canSubmit}
    on:click={rateNow}>Submit</button
  >
</section>

<style>
  .radio input ~ label {
    background-color: rgb(233, 225, 225);
    color: rgb(158, 146, 146);
  }
  .radio input:checked ~ label {
    background-color: rgb(70, 230, 22);
    color: white;
  }
</style>
