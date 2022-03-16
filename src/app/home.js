import * as R from 'ramda';
import * as free from '../fp/free';
import { setRef } from '../fp/ref';
import { addSop } from '../fp/sop';
import { viewMainPage} from '../view';

import * as router from '../app/router';

import Home from '../views/Home.svelte';

const goToHomePage = () => free.sequence([
  viewMainPage(Home),
  router.setHomeUrl(),
]);

export { goToHomePage };
