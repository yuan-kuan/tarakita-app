import App from './App.svelte';
import Sample from './Sample.svelte';

import { freeUtilsInterpretor } from './fp/free'; 
import { addSop, registerStaticInterpretor} from './fp/sop';
import { navigationInterpretor, start } from './app/router';
import { viewMainPage } from './view';
import { papaInterpretor } from './app/asker';

// Use Free Utils
registerStaticInterpretor(freeUtilsInterpretor);
registerStaticInterpretor(navigationInterpretor);
registerStaticInterpretor(papaInterpretor);

start();

// Kick start Svelte
const app = new App({
  target: document.body,
});

export default app;
