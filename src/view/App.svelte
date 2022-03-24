<script context="module">
  import { createRef } from 'fp/ref';
  import Modal from './Modal.svelte';

  export const primaryView = createRef(null);
  export const modalView = createRef(null);
  export const closeModal = createRef(null);
</script>

<script>
  import { onMount } from 'svelte';
  import Tailwindcss from './Tailwindcss.svelte';

  $: modalViewComponent = $modalView == '' ? null : $modalView;
</script>

<Tailwindcss />
<main
  class="relative mx-auto max-h-screen min-h-screen max-w-screen-md overflow-y-auto bg-white"
>
  <svelte:component this={$primaryView} />

  {#if modalViewComponent}
    <Modal on:click={$closeModal}>
      <svelte:component this={modalViewComponent} />
    </Modal>
  {/if}
</main>
