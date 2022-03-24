import * as R from 'ramda';
import * as free from 'fp/free';
import { setRef } from 'fp/ref';
import { addSop } from 'fp/sop';
import { viewMainPage} from 'view/view';

import * as router from 'app/router';
import * as tree from 'app/tree';
import * as user from 'app/user';
import * as answer from 'app/answer';
import {downloadQuestion} from 'app/sources';
import {HomeStores, OptionStores, AnsweringStores} from 'app/stores';

import Home from 'view/Home.svelte';
import OptionList from 'view/OptionList.svelte';
import AnsweringPage from 'view/AnsweringPage.svelte';
import { tapLog } from './utils';

const L = {
  id: R.lensProp('_id'),
  value: R.lensProp('value')
};

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

const presentBackToTopic = (topicId) =>
  setRef(AnsweringStores.backToParent, () => addSop(() => goToQuestion(topicId)))

const presentChildren = (children) =>
    free.sequence([
      setRef(OptionStores.options, R.map(R.view(L.value), children)),
      setRef(OptionStores.goToOptions, makeGoTos(children))
    ]);

const presentQuestionAncestor = (id) =>
  free.of(id)
    .chain(tree.getAncestors)
    .chain((ancestors) => free.sequence([
      setRef(AnsweringStores.ancestors, R.map(R.view(L.value), ancestors)),
      setRef(AnsweringStores.backToParent,
        () => addSop(() => goToQuestion(
          R.compose(R.view(L.id), R.head, R.takeLast(2))(ancestors)
        ))) 
    ]));

const goToAnswering = (id) =>
  free.sequence([
    viewMainPage(AnsweringPage),
    router.setQuestionUrl(id),
    presentQuestion(id),
    presentNextQuestion(id),
    presentQuestionAncestor(id)
  ]);

const goToFirstQuestion = (id) =>
  free.of(id)
    .chain(tree.findChildren)
    .map(R.head)
    .map(R.view(L.id))
    .chain(goToAnswering)

const goToTopic = (id) =>
  free.of(id)
    .chain(tree.hasSubtopic)
    .chain(
        R.ifElse(R.equals(true),
        R.always(goToListing(id)),
        R.always(goToFirstQuestion(id)),
      )
    );
   
const presentAncestor = (id) =>
  free.of(id)
    .chain(tree.getAncestors)
    .chain((ancestors) => free.sequence([
      setRef(OptionStores.ancestors, R.map(R.view(L.value), ancestors)),
      setRef(OptionStores.backToParent,
        R.ifElse(
          R.compose(R.gt(R.__, 0), R.length),
          R.always(() => addSop(() => goToQuestion(
            R.compose(R.view(L.id), R.head, R.takeLast(1))(ancestors)))),
          R.always(() => addSop(() => goToHomePage()))        
        )(ancestors)
      ) 
    ]));

const presentCurrent = (id) =>
  free.of(id)
    .chain(tree.getQuestion)
    .chain(setRef(OptionStores.currentName));

const goToListing = (id) =>
  free.of(id)
    .chain(tree.findChildren)
    .chain((children) =>
      free.sequence([
        viewMainPage(OptionList),
        router.setQuestionUrl(id),
        presentChildren(children),
        presentCurrent(id),
        presentAncestor(id),
      ])
    );

const goToQuestion = (id) =>
  free.of(id)
    .chain(tree.typeOf)
    .chain(
      R.cond([
        [R.equals('question'), R.always(goToAnswering(id))],
        [R.equals('subtopic'), R.always(goToFirstQuestion(id))],
        [R.equals('topic'), R.always(goToTopic(id))],
        [R.equals('area'), R.always(goToListing(id))],
        [R.equals('venue'), R.always(goToListing(id))],
      ]))
   
const presentVenue = () =>
  tree.findRoots()
    .chain((venues) => free.sequence([
      setRef(HomeStores.venues, R.pluck('value', venues)),
      setRef(HomeStores.goToVenues, makeGoTos(venues))
    ]));

const handleNewQuestion = () =>
  free.sequence([
    //answer.init(),
    presentVenue()
  ]);

const syncLatestQuestion = () =>
  free.sequence([
    setRef(HomeStores.downloadingQuestion, true),
    downloadQuestion()
      .map(R.prop('docs_read'))
      .chain(R.ifElse(
        R.gt(R.__, 0),
        R.always(handleNewQuestion()),
        R.always(free.of({}))))
      ,
    setRef(HomeStores.downloadingQuestion, false),
  ]);

const presentHomePage = () =>
  free.sequence([
    viewMainPage(Home),
    router.setHomeUrl(),
    presentVenue(),
    syncLatestQuestion(),
  ]);

const goToHomePage = () =>
  user.hasPreviousUser()
    .chain(
      R.ifElse(
        R.equals(true),
        R.always(presentHomePage()),
        R.always(user.goToRegisterPage())
      )
    );  

export { goToHomePage, goToQuestion };
