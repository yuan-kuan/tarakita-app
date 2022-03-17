import App from 'view/App.svelte';

import { freeUtilsInterpretor } from 'fp/free'; 
import { addSop, registerStaticInterpretor} from 'fp/sop';
import { navigationInterpretor, start } from 'app/router';
import { papaInterpretor } from 'app/asker';
import { viewMainPage } from 'view/view';

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
