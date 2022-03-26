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

  let title, subtitle, topic, subtopic;

  const unsubAncestors = ancestors.subscribe((values) => {
    title = undefined;
    subtitle = undefined;
    topic = undefined;
    subtopic = undefined;

    if (values.length >= 1) {
      title = values[0];
    }
    if (values.length >= 2) {
      subtitle = values[1];
    }
    if (values.length >= 3) {
      topic = values[2];
    }
    if (values.length >= 4) {
      topic = values[3];
      subtopic = values[2];
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
    {#if subtopic}
      <div class="flex h-14 items-end px-4 py-5">
        <span class="text-xl font-semibold">{subtopic}: {topic}</span>
      </div>
    {:else}
      <div class="flex h-14 items-end px-4 py-5">
        <span class="text-xl font-semibold">{topic}</span>
      </div>
    {/if}

    <h2 class="min-h-5r px-4 pb-4 text-lg">{$order}. {$question}</h2>

    <div class="flex w-full px-8">
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

    <div class="px-4 py-3" class:opacity-0={yesOrNo != true}>
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
  </section>

  <section>
    <p class="w-full text-center text-lg">{$order} of {$total}</p>
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

    {#if canSubmit}
      <button
        class="focus:outline-none rounded-full bg-white font-bold text-asPrimary"
        on:click={rateNow}
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
    {:else}
      <span class="h-16 w-16" />
    {/if}
  </div>
</div>
