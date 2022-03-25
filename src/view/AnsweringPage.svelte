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
    order,
    total,
  } = AnsweringStores;

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

  let yesOrNo;
  let currentRating;
  let canSubmit = false;

  const unsubRating = rating.subscribe((v) => {
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

  onDestroy(() => {
    unsubAncestors();
    unsubRating();
  });
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
    <h2 class="px-4 py-6 text-xl font-semibold">{topic}</h2>

    <h2 class="px-4 py-4 text-lg">{$order}. {$question}</h2>

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
            class="yesno-radio"
            class:yesno-radio-checked={yesOrNo == true}
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
            class="yesno-radio"
            class:yesno-radio-checked={yesOrNo == false}
          >
            no
          </label>
        </div>
      </div>
    </div>

    {#if yesOrNo}
      <div class="px-4 py-6">
        <label
          for="entry"
          class="mb-2 block text-lg font-semibold text-asPrimary "
        >
          Rates:
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
              class="rating-radio"
              class:rating-radio-checked={currentRating == 1}
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
              class="rating-radio"
              class:rating-radio-checked={currentRating == 2}
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
              class="rating-radio"
              class:rating-radio-checked={currentRating == 3}
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
              class="rating-radio"
              class:rating-radio-checked={currentRating == 4}
            >
              4
            </label>
          </div>
        </div>
      </div>
    {/if}
  </section>

  <section>
    <span class="w-full text-lg">{$order} of {$total}</span>
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
</div>
