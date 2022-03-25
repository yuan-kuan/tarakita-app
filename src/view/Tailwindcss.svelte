<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .topic-btn {
    @apply w-2/3 rounded-full bg-primary py-2 px-6 text-white text-xl;
  }

  .yesno-radio {
	  @apply h-14 flex w-20 items-center justify-center rounded-lg px-2 py-1 text-3xl font-bold bg-white text-asPrimary border-4 border-primary;
  }

  .yesno-radio-checked {
	  @apply bg-primary text-white;
	}

	.rating-radio {
    @apply flex h-14 w-14 items-center justify-center rounded-full px-2 py-1 text-3xl font-bold bg-white text-asPrimary border-4 border-primary;
  }

	.rating-radio-checked {
	  @apply bg-primary text-white;
	}
</style>
