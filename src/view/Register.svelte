<script>
  import { UserStores } from 'app/stores';

  import BigCheck from 'view/BigCheck.svelte';

  const { performRegister } = UserStores;

  let name = '';
  let allowSubmit = false;
  $: {
    allowSubmit = name.length > 0;
  }

  let oku = false;
  let blind = false;
  let deaf = false;
  let lowMobile = false;
  let others = false;

  const handleSubmit = (event) => {
    event.preventDefault();
    let forms = [];
    if (blind) forms.push('blind');
    if (deaf) forms.push('deaf');
    if (lowMobile) forms.push('lowMobile');
    if (others) forms.push('others');

    let finalOku = forms.length > 0;
    let data = {
      name,
      oku: finalOku,
      forms,
    };

    $performRegister(data);
    console.log('submitting ', data);
  };
</script>

<div class="min-h-screen bg-primary pt-4">
  <img class="mx-auto h-1/2 w-1/2" src="images/kotakita.png" />
  <form class="mb-4 px-8 pt-6 pb-8 " on:submit={handleSubmit}>
    <div class="mb-4">
      <label class="mb-2 block text-lg font-bold text-white" for="name">
        Name
      </label>
      <input
        class="focus:outline-none focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow"
        bind:value={name}
      />
    </div>

    <div class="mb-6">
      <BigCheck bind:value={oku} title="OKU" main={true} />
    </div>

    {#if oku}
      <div class="pl-2">
        <BigCheck bind:value={blind} title="Blind / Low vision" />
        <BigCheck bind:value={deaf} title="Deaf / Audio Barriers" />
        <BigCheck
          bind:value={lowMobile}
          title="Wheelchair / Scooter User / Low Mobility"
        />
        <BigCheck bind:value={others} title="Others" />
      </div>
    {/if}

    <div
      class="fixed bottom-14 left-1/2 mx-auto inline-flex w-5/6  -translate-x-1/2 transform items-center justify-between "
    >
      <button
        class="focus:outline-none rounded-full bg-white font-bold text-asPrimary"
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

      {#if allowSubmit}
        <button
          class="focus:outline-none rounded-full bg-white font-bold text-asPrimary"
          type="submit"
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
        <span />
      {/if}
    </div>
  </form>
</div>
