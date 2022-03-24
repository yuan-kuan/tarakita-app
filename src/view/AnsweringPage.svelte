<script>
  import { AnsweringStores } from 'app/stores';

  const { ancestors, question, hasNext, goToNext, backToParent, submit } =
    AnsweringStores;

  let yesOrNo;
  let rating;

  $: {
    console.log('yes or no', yesOrNo);
  }
</script>

<section class="container p-4">
  <h2 class="px-4 py-6 text-lg">{$question}</h2>

  <label
    for="entry"
    class="mb-2 block text-sm font-semibold text-gray-700 lg:text-base"
  >
    Your Rating
  </label>
  <div class="flex w-full">
    <div class="grid w-full grid-cols-4 gap-4">
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
          class="flex h-10 w-10 items-center justify-center rounded-lg px-2 py-1 text-3xl font-bold lg:h-14 lg:w-14 lg:text-5xl"
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
          class="flex h-10 w-10 items-center justify-center rounded-lg px-2 py-1 text-3xl font-bold lg:h-14 lg:w-14 lg:text-5xl"
        >
          no
        </label>
      </div>
    </div>
  </div>

  <label
    for="entry"
    class="mb-2 block text-sm font-semibold text-gray-700 lg:text-base"
  >
    Your Rating
  </label>
  <div class="flex w-full flex-col">
    <div class="grid w-full grid-cols-6 gap-2 xl:grid-cols-12">
      <div class="radio inline-block">
        <input
          name="rating"
          type="radio"
          id="rate1"
          hidden="hidden"
          bind:group={rating}
          value={1}
        />
        <label
          for="rate1"
          class="flex h-10 w-10 items-center justify-center rounded-lg px-2 py-1 text-3xl font-bold lg:h-14 lg:w-14 lg:text-5xl"
        >
          1
        </label>
      </div>

      <div class="radio inline-block">
        <input
          name="rating"
          type="radio"
          id="rate2"
          hidden="hidden"
          bind:group={rating}
          value={2}
        />
        <label
          for="rate2"
          class="flex h-10 w-10 items-center justify-center rounded-lg px-2 py-1 text-3xl font-bold lg:h-14 lg:w-14 lg:text-5xl"
        >
          2
        </label>
      </div>

      <div class="radio inline-block">
        <input
          name="rating"
          type="radio"
          id="rate3"
          hidden="hidden"
          bind:group={rating}
          value={3}
        />
        <label
          for="rate3"
          class="flex h-10 w-10 items-center justify-center rounded-lg px-2 py-1 text-3xl font-bold lg:h-14 lg:w-14 lg:text-5xl"
        >
          3
        </label>
      </div>

      <div class="radio inline-block">
        <input
          name="rating"
          type="radio"
          id="rate4"
          hidden="hidden"
          bind:group={rating}
          value={4}
        />
        <label
          for="rate4"
          class="flex h-10 w-10 items-center justify-center rounded-lg px-2 py-1 text-3xl font-bold lg:h-14 lg:w-14 lg:text-5xl"
        >
          4
        </label>
      </div>
    </div>
  </div>
</section>

<section class="container p-4">
  <button
    class="hover:bg-blue-dark rounded bg-blue-500 py-2 px-6 font-bold text-white"
    on:click={$backToParent}
    >Back
  </button>
  {#if $hasNext}
    <button
      class="hover:bg-blue-dark rounded bg-blue-500 py-2 px-6 font-bold text-white"
      on:click={$goToNext}>Next Question</button
    >
  {/if}
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
