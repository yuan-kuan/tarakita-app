<script>
  import { AnsweringStores } from 'app/stores';

  const { comment, submitComment } = AnsweringStores;

  let positive = '';
  let negative = '';

  const submit = (e) => {
    $submitComment(positive, negative);
  }
</script>

<header>Go back from here.</header>

<section>
  <h2>Topic or subtopic goes here.</h2>

  <div>
    <h3>Positive:</h3>

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
          <button class="rounded-full bg-black py-1 px-2 text-white"
           on:click={submit}
            >Comment</button
          >
        </div>
      </div>
    </div>
  </div>
</section>
