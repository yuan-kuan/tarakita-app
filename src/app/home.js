import * as R from 'ramda';
import * as free from 'fp/free';
import { setRef } from 'fp/ref';
import { addSop } from 'fp/sop';
import { viewMainPage} from 'view/view';

import * as router from 'app/router';
import * as tree from 'app/tree';
import {HomeStores, OptionStores, AnsweringStores} from 'app/stores';

import Home from 'view/Home.svelte';
import OptionList from 'view/OptionList.svelte';
import AnsweringPage from 'view/AnsweringPage.svelte';

const makeGoTos = (docs) =>
    R.pipe(
      R.pluck('_id'),
      R.map((id) => () => addSop(() => goToQuestion(id)))
    )(docs);

const presentNextQuestion = (id) =>
  free.of(id)
    .chain(tree.getNextSibling)
    .call(free.bichain(
      R.always(setRef(AnsweringStores.hasNext, false)),
      (nextQuestionDoc) => free.sequence([
        setRef(AnsweringStores.hasNext, true),
        setRef(AnsweringStores.goToNext, () => addSop(() => goToQuestion(R.prop("_id", nextQuestionDoc)))),
      ])
    ));

const presentQuestion = (id) =>
  free.of(id)
    .chain(tree.getQuestion)
    .chain(setRef(AnsweringStores.question))

const presentChildren = (children) =>
    free.sequence([
      setRef(OptionStores.options, R.pluck('value', children)),
      setRef(OptionStores.goToOptions, makeGoTos(children))
    ]);

const goToAnswering = (id) =>
  free.sequence([
    viewMainPage(AnsweringPage),
    router.setQuestionUrl(id),
    presentQuestion(id),
    presentNextQuestion(id)
  ]);
    

const goToListing = (id) =>
  free.of(id)
    .chain(tree.findChildren)
    .chain((children) =>
      free.sequence([
        viewMainPage(OptionList),
        router.setQuestionUrl(id),
        presentChildren(children)
      ])
    );

const goToQuestion = (id) =>
  free.of(id)
    .map(tree.typeOf)
    .chain(
      R.ifElse(
        R.equals('question'),
        R.always(goToAnswering(id)),
        R.always(goToListing(id))
      )
    )


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
