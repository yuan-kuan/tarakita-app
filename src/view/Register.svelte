<script>
  import { createForm } from "svelte-forms-lib";
  import { UserStores } from 'app/stores';

	const { performRegister } = UserStores;

  const { form, handleChange, handleSubmit } = createForm({
    initialValues: {
      name: "",
    },
    onSubmit: values => {
      $performRegister(values);
    }
  });
</script>

<header>
  <p>Logo Goes Here</p>
</header>

<form on:submit={handleSubmit}>
  <label for="name">name</label>
  <input
    id="name"
    name="name"
    on:change={handleChange}
    bind:value={$form.name}
  />

  <button type="submit">Start</button>
</form>
