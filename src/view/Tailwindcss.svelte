<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .topic-btn {
    @apply w-2/3 rounded-full bg-primary py-2 px-6 text-xl text-white;
  }

  .yesno-radio {
    @apply flex h-14 w-20 items-center justify-center rounded-lg border-4 border-primary bg-white px-2 py-1 text-3xl font-bold text-asPrimary;
  }

  .yesno-radio-checked {
    @apply bg-primary text-white;
  }

  .rating-radio {
    @apply flex h-14 w-14 items-center justify-center rounded-full border-4 border-primary bg-white px-2 py-1 text-3xl font-bold text-asPrimary;
  }

  .rating-radio-checked {
    @apply bg-primary text-white;
  }
</style>
