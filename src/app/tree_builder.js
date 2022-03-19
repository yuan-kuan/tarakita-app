import * as R from 'ramda';
import * as free from 'fp/free';
import { bulkDocs } from 'app/database';
import { tapLog } from './utils';

const L = {
  latestVenue: R.lensProp('_latestVenue'),
  latestArea: R.lensProp('_latestArea'),
  latestTopic: R.lensProp('_latestTopic'),
  latestQuestion: R.lensProp('_latestQuestion'),
  id: R.lensProp('_id'),
  value: R.lensProp('value'),
  type: R.lensProp('type'),
};

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
const convertToParentId = (id) => id.replace('.', '>');

const intTo0padded = (n) => n.toString().padStart(2, '0'); 

const insertFirstOrder = (s) => `${s}.${intTo0padded(1)}`;

/**
* @param {string} s
*/
const incrementString = R.compose(intTo0padded, R.inc, parseInt)

const incrementOrder =
  R.pipe(
    R.split('.'),
    R.over(R.lensIndex(1), incrementString),
    R.join('.'),
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

const generateKeyBaseOnState = (currentLens, parentLens, treeState) =>
  R.ifElse(
    R.pipe(R.view(currentLens), R.isNil),
    generateFirstKey(parentLens),
    generateNextKey(currentLens),
  )(treeState);
  
const generateAreaKey = (treeState) =>
  generateKeyBaseOnState(L.latestArea, L.latestVenue, treeState);  

const generateTopicKey = (treeState) =>
  generateKeyBaseOnState(L.latestTopic, L.latestArea, treeState);  

const generateQuestionKey = (treeState) =>
  generateKeyBaseOnState(L.latestQuestion, L.latestTopic, treeState);  

const addVenue = R.curry((venue, treeState) =>
  R.pipe(
    R.set(R.lensProp(generateVenueKey(venue)), venue),
    R.set(L.latestVenue, generateVenueKey(venue)),
  )(treeState)
);

const addArea = R.curry((area, treeState) => {
  const areaKey = generateAreaKey(treeState);

  return R.pipe(
    // @ts-ignore areaKey is (any) => never. ???
    R.set(R.lensProp(areaKey), area),
    R.set(L.latestArea, areaKey),
    R.set(L.latestTopic, null),
    R.set(L.latestQuestion, null)
  )(treeState)
});

const addTopic = R.curry((topic, treeState) => {
  const topicKey = generateTopicKey(treeState);

  return R.pipe(
    // @ts-ignore areaKey is (any) => never. ???
    R.set(R.lensProp(topicKey), topic),
    R.set(L.latestTopic, topicKey),
    R.set(L.latestQuestion, null)
  )(treeState)
});

const addQuestion = R.curry((question, treeState) => {
  const questionKey = generateQuestionKey(treeState);
  return R.pipe(
    // @ts-ignore areaKey is (any) => never. ???
    R.set(R.lensProp(questionKey), question),
    R.set(L.latestQuestion, questionKey),
  )(treeState)
});

const removeInternals =
  R.pipe(
    R.set(L.latestVenue, null),
    R.set(L.latestArea, null),
    R.set(L.latestTopic, null),
    R.set(L.latestQuestion, null),
    R.reject(R.isNil)
  )

const determineType =
  R.ifElse(
    R.test(/^q_[^.>]*$/),
    R.always('venue'),
    R.always('question'),
  );  

const storeState = (treeState) =>
  free.of(treeState)
    .map(removeInternals)
    .map(R.mapObjIndexed((v, k, obj) =>
      R.pipe(
        R.set(L.id, k),
        R.set(L.value, v),
        R.set(L.type, determineType(k)),
      )({})))
    .map(R.values)
    .chain(bulkDocs)
    

export {addVenue, addArea, addTopic, addQuestion, storeState}
