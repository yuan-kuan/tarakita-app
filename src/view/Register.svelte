<script>
  import { UserStores } from 'app/stores';

  import BigCheck from 'view/BigCheck.svelte';

  const { performRegister } = UserStores;

  let name = '';
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

<header>
  <p>Logo Goes Here</p>
</header>

<form
  class="mb-4 rounded bg-white px-8 pt-6 pb-8 shadow-md"
  on:submit={handleSubmit}
>
  <div class="mb-4">
    <label class="mb-2 block text-lg font-bold text-gray-700" for="name">
      Name
    </label>
    <input
      class="focus:outline-none focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow"
      bind:value={name}
    />
  </div>

  <div class="mb-4">
    <BigCheck bind:value={oku} title="OKU" main={true} />
  </div>

  {#if oku}
    <div>
      <BigCheck bind:value={blind} title="Blind / Low vision" />
      <BigCheck bind:value={deaf} title="Deaf / Audio Barriers" />
      <BigCheck
        bind:value={lowMobile}
        title="Wheelchair / Scooter User / Low Mobility"
      />
      <BigCheck bind:value={others} title="Others" />
    </div>
  {/if}

  <button
    class="focus:outline-none focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
    type="submit">Start</button
  >
</form>
