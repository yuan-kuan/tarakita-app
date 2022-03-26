import * as R from 'ramda';
import daggy from 'daggy';
import { Future, resolve } from 'fluture';
import * as papa from 'papaparse';

import * as free from 'fp/free';
import { setRef } from 'fp/ref';
import { addSop } from 'fp/sop';
import { viewMainPage } from 'view/view';

import * as router from 'app/router';
import { AskerStores } from 'app/stores';
import * as tree_builder from 'app/tree_builder';

import Asker from 'view/Asker.svelte';
import { tapLog } from './utils';
import { uploadQuestion } from './sources';
import { goToHomePage } from './home';

const Papa = daggy.taggedSum('Papa', {
  Parse: ['file'],
});
// @ts-ignore
const { Parse } = Papa;

const papaToFuture = (p) =>
  p.cata({
    Parse: (file) =>
      Future((reject, resolve) => {
        papa.parse(file, {
          complete: (result) => {
            resolve(result.data);
          },
        });
        return () => {};
      }),
  });

const papaInterpretor = [Papa, papaToFuture];
const parse = (file) => free.lift(Parse(file));

const L = {
  head: R.lensIndex(0),
  typeCol: R.lensIndex(8),
  filename: R.lensProp('name'),
};

const basename = R.pipe(R.view(L.filename), R.split('.'), R.head);

const performParseCSV = (file) =>
  free
    .of(file)
    .chain(parse)
    .map(R.reject(R.pipe(R.view(L.head), R.isEmpty)))
    // Base on each row, prepare the builder function
    // It is a curried function which wait for a tree state
    .map(
      R.map(
        R.cond([
          [
            R.pipe(R.view(L.typeCol), R.equals('a')),
            R.pipe(R.view(L.head), tree_builder.addArea),
          ],
          [
            R.pipe(R.view(L.typeCol), R.equals('t')),
            R.pipe(R.view(L.head), tree_builder.addTopic),
          ],
          [
            R.pipe(R.view(L.typeCol), R.equals('s')),
            R.pipe(R.view(L.head), tree_builder.addSubtopic),
          ],
          [
            R.pipe(R.view(L.typeCol), R.equals('')),
            R.pipe(R.view(L.head), tree_builder.addQuestion),
          ],
        ])
      )
    )
    // Use reduce to apply the list of builder function to the initial treestate
    // building it in order of the csv question
    .map(
      R.reduce(
        (treeState, builder) => builder(treeState),
        tree_builder.addVenue(basename(file), {})
      )
    )
    .chain(tree_builder.storeState);

const performUpload = () => free.sequence([uploadQuestion(), goToHomePage()]);

const goToAskerPage = () =>
  free.sequence([
    viewMainPage(Asker),
    router.setAskerUrl(),
    setRef(AskerStores.performParse, (file) =>
      addSop(() => performParseCSV(file))
    ),
    setRef(AskerStores.performUpload, () => addSop(() => performUpload())),
  ]);

export { papaInterpretor, parse, goToAskerPage };
