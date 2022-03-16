import * as R from 'ramda';
import daggy from 'daggy';
import { Future, resolve } from 'fluture';
import * as papa from 'papaparse';

import * as free from '../fp/free';
import { setRef } from '../fp/ref';
import { addSop } from '../fp/sop';
import { viewMainPage} from '../view';

import * as router from '../app/router';
import { AskerStores } from '../stores';

import Asker from '../views/Asker.svelte';

const Papa = daggy.taggedSum('Papa', {
  Parse: ['file']
});
// @ts-ignore
const { Parse } = Papa;

const papaToFuture = (p) =>
  p.cata({
    Parse: (file) => Future((reject, resolve) => {
      papa.parse(file, {
        complete: (result) => {
          console.log('papa result ', result);
          resolve(result);
        }
      }); 
      return () => {};
    })
  });

const papaInterpretor = [Papa, papaToFuture];
const parse = (file) => free.lift(Parse(file));


const goToAskerPage = () => free.sequence([
  viewMainPage(Asker),
  router.setAskerUrl(),
  setRef(AskerStores.performParse, (file) => addSop(() => parse(file)))
]);

export { papaInterpretor, parse, goToAskerPage };
