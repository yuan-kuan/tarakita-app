<script>
  import { AskerStores } from 'app/stores.js';
  const { performParse, performUpload } = AskerStores;

  const fileChanged = (event) => {
    let blob = event.target.files[0];
    if (blob) {
      $performParse(blob);
    }
  };
</script>

<h1>Ask your question here</h1>

<p>Actually, just submit the csv</p>

<label>Question CSV</label>
<input type="file" on:change={fileChanged} />

<br />

<button on:click={$performUpload}>Upload question</button>
