import * as R from 'ramda';
import * as free from '../fp/free';
import { setRef } from '../fp/ref';
import { addSop } from '../fp/sop';
import { viewMainPage} from '../view';

import * as router from '../app/router';

import Asker from '../views/Asker.svelte';

const goToAskerPage = () => free.sequence([
  viewMainPage(Asker),
  router.setAskerUrl(),
]);

export { goToAskerPage };
