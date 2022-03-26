import * as R from 'ramda';
import * as free from 'fp/free';
import { setRef, resetRef } from 'fp/ref';
import { addSop } from 'fp/sop';
import { viewMainPage } from 'view/view';

import * as router from 'app/router';
import * as tree from 'app/tree';
import * as user from 'app/user';
import * as answer from 'app/answer';
import { downloadQuestion, reset, uploadAnswer } from 'app/sources';
import {
  HomeStores,
  OptionStores,
  AnsweringStores,
  ResultStores,
} from 'app/stores';

import Home from 'view/Home.svelte';
import OptionList from 'view/OptionList.svelte';
import AnsweringPage from 'view/AnsweringPage.svelte';
import CommentPage from 'view/CommentPage.svelte';
import Result from 'view/Result.svelte';
import { reload, tapLog } from './utils';

const L = {
  id: R.lensProp('_id'),
  value: R.lensProp('value'),
  rating: R.lensProp('rating'),
  total: R.lensProp('total'),
};

const makeGoTos = (docs) =>
  R.pipe(
    R.pluck('_id'),
    R.map((id) => () => addSop(() => goToQuestion(id)))
  )(docs);

const performCommentSubmission = (topicId, pos, neg) =>
  free
    .of(answer.createCommentSubmission(pos, neg))
    .chain(answer.putComment(topicId))
    .chain((_) =>
      free
        .of(topicId)
        .map(tapLog('topic'))
        .chain(tree.getAncestors)
        .map(R.last)
        .map(R.view(L.id))
        .map(tapLog('topic de topic'))
        .chain(goToQuestion)
    );

const goToComment = (topicId) =>
  free
    .of(topicId)
    .chain(answer.getComment)
    .chain((comment) =>
      free.sequence([
        viewMainPage(CommentPage),
        router.setCommentUrl(topicId),
        setRef(AnsweringStores.comment, comment),
        setRef(AnsweringStores.submitComment, (pos, neg) =>
          addSop(() => performCommentSubmission(topicId, pos, neg))
        ),
        presentCurrent(topicId),
        presentAncestor(topicId),
      ])
    );

const goToNextQuestion = (id) =>
  free
    .of(id)
    .chain(tree.getNextSibling)
    .call(
      free.bichain(
        R.always(
          free
            .of(id)
            .chain(tree.getAncestors)
            .map(R.last)
            .map(R.view(L.id))
            .chain(goToComment)
        ),
        (nextQuestionDoc) =>
          free.of(nextQuestionDoc).map(R.view(L.id)).chain(goToQuestion)
      )
    );

const performSubmitAnswer = (questionId, rating) => {
  return free.sequence([
    free
      .of(rating)
      .map(answer.createSubmission)
      .chain(answer.submit(questionId)),
    goToNextQuestion(questionId),
  ]);
};

const presentQuestion = (id) =>
  free.sequence([
    free.of(id).chain(tree.getQuestion).chain(setRef(AnsweringStores.question)),
    free.of(id).map(tree.orderOf).chain(setRef(AnsweringStores.order)),
    free
      .of(id)
      .chain(answer.getAnswer)
      .chain((answerDoc) =>
        free.sequence([
          setRef(AnsweringStores.rating, R.view(L.rating, answerDoc)),
          setRef(AnsweringStores.submit, (rating) =>
            addSop(() => performSubmitAnswer(id, rating))
          ),
        ])
      ),
  ]);

const presentBackToTopic = (topicId) =>
  setRef(AnsweringStores.backToParent, () =>
    addSop(() => goToQuestion(topicId))
  );

const presentChildren = (children) =>
  free.sequence([
    setRef(OptionStores.options, R.map(R.view(L.value), children)),
    setRef(OptionStores.goToOptions, makeGoTos(children)),
  ]);

const presentTotal = (ancestors) =>
  free
    .of(ancestors)
    .map(R.last)
    .map(R.view(L.id))
    .chain(answer.ratio)
    .map(R.view(L.total))
    .chain(setRef(AnsweringStores.total));

const presentQuestionAncestor = (id) =>
  free
    .of(id)
    .chain(tree.getAncestors)
    .chain((ancestors) =>
      free.sequence([
        setRef(AnsweringStores.ancestors, R.map(R.view(L.value), ancestors)),
        setRef(AnsweringStores.backToParent, () =>
          addSop(() =>
            goToQuestion(
              R.compose(R.view(L.id), R.head, R.takeLast(2))(ancestors)
            )
          )
        ),
        presentTotal(ancestors),
      ])
    );

const goToAnswering = (id) =>
  free.sequence([
    viewMainPage(AnsweringPage),
    router.setQuestionUrl(id),
    presentQuestion(id),
    presentQuestionAncestor(id),
  ]);

const goToFirstQuestion = (id) =>
  free
    .of(id)
    .chain(tree.findChildren)
    .map(R.head)
    .map(R.view(L.id))
    .chain(goToAnswering);

const goToTopic = (id) =>
  free
    .of(id)
    .chain(tree.hasSubtopic)
    .chain(
      R.ifElse(
        R.equals(true),
        R.always(goToListing(id)),
        R.always(goToFirstQuestion(id))
      )
    );

const presentAncestor = (id) =>
  free
    .of(id)
    .chain(tree.getAncestors)
    .chain((ancestors) =>
      free.sequence([
        setRef(OptionStores.ancestors, R.map(R.view(L.value), ancestors)),
        setRef(
          OptionStores.backToParent,
          R.ifElse(
            R.compose(R.gt(R.__, 0), R.length),
            R.always(() =>
              addSop(() =>
                goToQuestion(
                  R.compose(R.view(L.id), R.head, R.takeLast(1))(ancestors)
                )
              )
            ),
            R.always(() => addSop(() => goToHomePage()))
          )(ancestors)
        ),
      ])
    );

const presentCurrent = (id) =>
  free.of(id).chain(tree.getQuestion).chain(setRef(OptionStores.currentName));

const goToVenue = (id) =>
  free.sequence([
    goToListing(id),
    answer.ratio(id).chain(setRef(ResultStores.ratio)),
    setRef(OptionStores.goToResult, () => addSop(() => goToResult(id))),
  ]);

const goToListing = (id) =>
  free
    .of(id)
    .chain(tree.findChildren)
    .chain((children) =>
      free.sequence([
        viewMainPage(OptionList),
        router.setQuestionUrl(id),
        presentChildren(children),
        presentCurrent(id),
        presentAncestor(id),
        resetRef(ResultStores.ratio),
      ])
    );

const goToQuestion = (id) =>
  free
    .of(id)
    .chain(tree.typeOf)
    .chain(
      R.cond([
        [R.equals('question'), R.always(goToAnswering(id))],
        [R.equals('subtopic'), R.always(goToFirstQuestion(id))],
        [R.equals('topic'), R.always(goToTopic(id))],
        [R.equals('area'), R.always(goToListing(id))],
        [R.equals('venue'), R.always(goToVenue(id))],
      ])
    );

const presentVenue = () =>
  tree
    .findRoots()
    .chain((venues) =>
      free.sequence([
        setRef(HomeStores.venues, R.pluck('value', venues)),
        setRef(HomeStores.goToVenues, makeGoTos(venues)),
      ])
    );

const handleNewQuestion = () => free.sequence([answer.init(), presentVenue()]);

const syncLatestQuestion = () =>
  free.sequence([
    setRef(HomeStores.downloadingQuestion, true),
    downloadQuestion()
      .map(R.prop('docs_read'))
      .chain(
        R.ifElse(
          R.gt(R.__, 0),
          R.always(handleNewQuestion()),
          R.always(free.of({}))
        )
      ),
    setRef(HomeStores.downloadingQuestion, false),
  ]);

const performReset = () => free.sequence([reset(), user.reset(), reload()]);

const presentHomePage = () =>
  free.sequence([
    viewMainPage(Home),
    router.setHomeUrl(),
    presentVenue(),
    syncLatestQuestion(),
    setRef(HomeStores.reset, () => addSop(() => performReset())),
  ]);

const goToHomePage = () =>
  user
    .hasPreviousUser()
    .chain(
      R.ifElse(
        R.equals(true),
        R.always(presentHomePage()),
        R.always(user.goToRegisterPage())
      )
    );

const performUploadAnswer = (venueId) =>
  free.sequence([uploadAnswer(), goToHomePage()]);

const goToResult = (venueId) =>
  free.sequence([
    viewMainPage(Result),
    router.setResultUrl(venueId),
    presentAncestor(venueId),
    presentCurrent(venueId),
    answer.ratio(venueId).chain(setRef(ResultStores.ratio)),
    setRef(ResultStores.score, 0),
    setRef(ResultStores.upload, () =>
      addSop(() => performUploadAnswer(venueId))
    ),
  ]);

export { goToHomePage, goToQuestion, goToComment, goToResult };
