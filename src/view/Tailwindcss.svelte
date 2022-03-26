<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .topic-btn {
    @apply w-2/3 rounded-full bg-primary py-2 px-6 text-xl text-white;
  }

  .btn {
    @apply m-1 select-none rounded-full border px-6 py-2 text-sm font-bold leading-loose;
  }

  .yesno-radio {
    @apply flex h-10 w-16 items-center justify-center rounded-lg border-4 border-primary bg-white px-2 py-1 text-xl font-bold text-asPrimary;
  }

  .yesno-radio-checked {
    @apply bg-primary text-white;
  }

  .rating-radio {
    @apply flex h-10 w-10 items-center justify-center rounded-full border-4 border-primary bg-white px-2 py-1 text-xl font-bold text-asPrimary;
  }

  .rating-radio-checked {
    @apply bg-primary text-white;
  }

  .min-h-4r {
    min-height: 5rem;
  }
</style>
