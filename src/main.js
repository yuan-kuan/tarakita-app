import App from 'view/App.svelte';

import { freeUtilsInterpretor } from 'fp/free';
import { addSop, registerStaticInterpretor } from 'fp/sop';
import { setupDatabaseInterpretor } from 'app/database';
import { setupKVInterpretor } from 'app/kv';
import { navigationInterpretor, start } from 'app/router';
import { papaInterpretor } from 'app/asker';
import { utilsInterpretor } from 'app/utils';
import { viewMainPage } from 'view/view';

// Use Free Utils
registerStaticInterpretor(freeUtilsInterpretor);
registerStaticInterpretor(setupKVInterpretor());
registerStaticInterpretor(setupDatabaseInterpretor());
registerStaticInterpretor(navigationInterpretor);
registerStaticInterpretor(papaInterpretor);
registerStaticInterpretor(utilsInterpretor);

start();

// Kick start Svelte
const app = new App({
  target: document.body,
});

export default app;
