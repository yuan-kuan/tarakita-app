import * as R from 'ramda';
import * as free from 'fp/free';
import { setRef } from 'fp/ref';
import { addSop } from 'fp/sop';
import { viewMainPage} from 'view/view';

import * as router from 'app/router';
import * as tree from 'app/tree';
import {HomeStores, OptionStores} from 'app/stores';

import Home from 'view/Home.svelte';
import OptionList from 'view/OptionList.svelte';

const makeGoTos = (docs) =>
    R.pipe(
      R.pluck('_id'),
      R.map((id) => () => addSop(() => goToQuestion(id)))
    )(docs);

const presentChildren = (children) =>
    free.sequence([
      setRef(OptionStores.options, R.pluck('value', children)),
      setRef(OptionStores.goToOptions, makeGoTos(children))
    ]);
  
const goToQuestion = (id) =>
  free.of(id)
    .chain(tree.findChildren)
    .chain((children) =>
      free.sequence([
        viewMainPage(OptionList),
        router.setQuestionUrl(id),
        presentChildren(children)
      ])
    );

const presentVenue = () =>
  tree.findRoots()
    .chain((venues) => free.sequence([
      setRef(HomeStores.venues, R.pluck('value', venues)),
      setRef(HomeStores.goToVenues, makeGoTos(venues))
    ]));

const goToHomePage = () => free.sequence([
  viewMainPage(Home),
  router.setHomeUrl(),
  presentVenue(),
]);

export { goToHomePage, goToQuestion };
