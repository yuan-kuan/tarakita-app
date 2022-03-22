import * as R from 'ramda';
import * as free from 'fp/free';
import { bulkDocs } from 'app/database';
import { tapLog } from './utils';

const L = {
  latestVenue: R.lensProp('_latestVenue'),
  latestArea: R.lensProp('_latestArea'),
  latestTopic: R.lensProp('_latestTopic'),
  latestSubtopic: R.lensProp('_latestSubtopic'),
  latestQuestion: R.lensProp('_latestQuestion'),
  id: R.lensProp('_id'),
  value: R.lensProp('value'),
  type: R.lensProp('type'),
};

const leafDot = '-';
const parentDot = '+';

const prefixVenue = (s) => `q_${s}`;

const normaliseVenueName = R.compose(R.toLower, R.replace(/[ .>-]/g, '_'))

/**
* convert id to a parent id, which is ready to be postfix with new order
* e.g. q_venue.01 --> q_venue>01
* e.g. q_venue>02.03 --> q_venue>02>03
*
* @param {string} id
* @returns {string}
*/
const convertToParentId = (id) => id.replace(leafDot, parentDot);

const intTo0padded = (n) => n.toString().padStart(2, '0'); 

const insertFirstOrder = (s) => `${s}${leafDot}${intTo0padded(1)}`;

/**
* @param {string} s
*/
const incrementString = R.compose(intTo0padded, R.inc, parseInt)

const incrementOrder =
  R.pipe(
    R.split(leafDot),
    R.over(R.lensIndex(1), incrementString),
    R.join(leafDot),
  );

const generateVenueKey = R.compose(prefixVenue, normaliseVenueName);

const generateFirstKey = R.curry((lens, treeState) =>
  R.pipe(
    R.view(lens),
    convertToParentId,
    insertFirstOrder 
  )(treeState)
);

const generateNextKey = R.curry((lens, treeState) =>
  R.pipe(
    R.view(lens),
    incrementOrder,
  )(treeState)
);

const generateKeyBaseOnState = R.curry((currentLens, parentLens, treeState) =>
  R.ifElse(
    R.pipe(R.view(currentLens), R.isNil),
    generateFirstKey(parentLens),
    generateNextKey(currentLens),
  )(treeState));
  
const generateAreaKey = (treeState) =>
  generateKeyBaseOnState(L.latestArea, L.latestVenue, treeState);  

const generateTopicKey = (treeState) =>
  generateKeyBaseOnState(L.latestTopic, L.latestArea, treeState);  

const generateSubtopicKey = (treeState) =>
  generateKeyBaseOnState(L.latestSubtopic, L.latestTopic, treeState);  

const generateQuestionKey = (treeState) =>
  R.ifElse(
    R.pipe(R.view(L.latestSubtopic), R.isNil),
    generateKeyBaseOnState(L.latestQuestion, L.latestTopic),  
    generateKeyBaseOnState(L.latestQuestion, L.latestSubtopic),
  )(treeState);

const generateDoc = R.curry((id, value, type) =>
  R.pipe(
    R.set(L.id, id),
    R.set(L.value, value),
    R.set(L.type, type),
  )({}));

const addVenue = R.curry((venue, treeState) => {
  const doc = generateDoc(generateVenueKey(venue), venue, 'venue');

  return R.pipe(
    R.set(R.lensProp(R.view(L.id, doc)), doc),
    R.set(L.latestVenue, generateVenueKey(venue)),
    R.set(L.latestTopic, null),
    R.set(L.latestSubtopic, null),
    R.set(L.latestQuestion, null)
  )(treeState);
});

const addArea = R.curry((area, treeState) => {
  const doc = generateDoc(generateAreaKey(treeState), area, 'area');

  return R.pipe(
    R.set(R.lensProp(R.view(L.id, doc)), doc),
    R.set(L.latestArea, R.view(L.id, doc)),
    R.set(L.latestTopic, null),
    R.set(L.latestSubtopic, null),
    R.set(L.latestQuestion, null)
  )(treeState)
});

const addTopic = R.curry((topic, treeState) => {
  const doc = generateDoc(generateTopicKey(treeState), topic, 'topic');

  return R.pipe(
    R.set(R.lensProp(R.view(L.id, doc)), doc),
    R.set(L.latestTopic, R.view(L.id, doc)),
    R.set(L.latestSubtopic, null),
    R.set(L.latestQuestion, null)
  )(treeState)
});

const addSubtopic = R.curry((subtopic, treeState) => {
  const doc = generateDoc(generateSubtopicKey(treeState), subtopic, 'subtopic');

  return R.pipe(
    R.set(R.lensProp(R.view(L.id, doc)), doc),
    R.set(L.latestSubtopic, R.view(L.id, doc)),
    R.set(L.latestQuestion, null)
  )(treeState)
});

const addQuestion = R.curry((question, treeState) => {
  const doc = generateDoc(generateQuestionKey(treeState), question, 'question');
  
  return R.pipe(
    R.set(R.lensProp(R.view(L.id, doc)), doc),
    R.set(L.latestQuestion, R.view(L.id, doc)),
  )(treeState)
});

const removeInternals =
  R.pipe(
    R.set(L.latestVenue, null),
    R.set(L.latestArea, null),
    R.set(L.latestTopic, null),
    R.set(L.latestSubtopic, null),
    R.set(L.latestQuestion, null),
    R.reject(R.isNil)
  )

const determineType =
  R.ifElse(
    R.test(/^q_[^-+]*$/),
    R.always('venue'),
    R.always('question'),
  );  

const storeState = (treeState) =>
  free.of(treeState)
    .map(removeInternals)
    .map(R.values)
    .chain(bulkDocs)

export {addVenue, addArea, addTopic, addSubtopic, addQuestion, storeState}
