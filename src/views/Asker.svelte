<script>
  import { AskerStores } from '../stores.js';
  const { performParse } = AskerStores;

  const fileChanged = (event) => {
		let blob = event.target.files[0];
		if (blob) {
			$performParse(blob);
		}
  }
</script>

<h1>Ask your question here</h1>

<p>Actually, just submit the csv</p>

<label>Question CSV</label>
<input type="file" on:change={fileChanged} />
}
