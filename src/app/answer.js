import * as R from 'ramda';
import * as free from 'fp/free';
import * as db from 'app/database';
import { getUserId } from './user';
import { tapLog } from './utils';

const L = {
  id: R.lensProp('_id'),
  type: R.lensProp('type'),
  rating: R.lensProp('rating'),
  comment: R.lensProp('comment'),
  answered: R.lensProp('answered'),
  total: R.lensProp('total'),
  startKey: R.lensProp('startkey'),
  endKey: R.lensProp('endkey'),
  includeDoc: R.lensProp('include_docs'),
};

const leafDot = '-';
const parentDot = '+';

const convertToParentId = (id) => id.replace(leafDot, parentDot);

const convertToAnswerPrefix = R.replace(/q/, 'a');

const convertToAnswerId = (id) =>
  free
    .of(id)
    .map(convertToAnswerPrefix)
    .map(R.curry((prefix, userId) => `${prefix}:${userId}`))
    .ap(getUserId());

const generateAllDocOption = (id) =>
  R.pipe(
    R.set(L.startKey, `${id}`),
    R.set(L.endKey, `${id}\ufff0`),
    R.set(L.includeDoc, true)
  )({});

const generateEmptyAnswerDoc = (id) =>
  R.pipe(R.set(L.id, id), R.set(L.type, 'answer'))({});

const findAllAnswerUnder = (id) =>
  free
    .of(id)
    .map(convertToAnswerPrefix)
    .map(convertToParentId)
    .map(generateAllDocOption)
    .chain(db.allDocs);

const allQuestionIds = () =>
  free
    .of({
      selector: {
        type: 'question',
      },
      fields: ['_id'],
    })
    .chain(db.find)
    .map(R.pluck('_id'));

const init = () =>
  allQuestionIds()
    .map(R.map(convertToAnswerId))
    .chain(free.sequence)
    .map(R.map(generateEmptyAnswerDoc))
    .chain(db.bulkDocs);

const createSubmission = (rating, comment) =>
  R.pipe(R.set(L.rating, rating), R.set(L.comment, comment))({});

const isSubmissionTheSame = R.curry((previous, next) => {
  const ratingSame = R.equals(
    R.view(L.rating, previous),
    R.view(L.rating, next)
  );
  const commentSame = R.equals(
    R.view(L.comment, previous),
    R.view(L.comment, next)
  );
  return R.and(ratingSame, commentSame);
});

const submit = R.curry((questionId, submission) =>
  free
    .of(questionId)
    .chain(convertToAnswerId)
    .chain(db.get)
    .chain(
      R.ifElse(
        isSubmissionTheSame(submission),
        R.always(free.of({})),
        (previous) =>
          free.of(previous).map(R.mergeLeft(submission)).chain(db.put)
      )
    )
);

const generateRatioDoc = (answered, total) =>
  R.pipe(R.set(L.answered, answered), R.set(L.total, total))({});

const findAnswered = R.filter(
  R.compose(R.complement(R.isNil), R.view(L.rating))
);

const ratio = (parentId) =>
  free
    .of(parentId)
    .chain(findAllAnswerUnder)
    .map((docs) =>
      generateRatioDoc(R.length(findAnswered(docs)), R.length(docs))
    );

const finalResult = (venueId) =>
  free
    .of(venueId)
    .chain(findAllAnswerUnder)
    .map(R.pluck('rating'))
    .map(R.reduce((acc, value) => acc + value, 0));

const getAnswer = (questionId) =>
  free.of(questionId).chain(convertToAnswerId).chain(db.get);

export { init, createSubmission, submit, ratio, finalResult, getAnswer };
