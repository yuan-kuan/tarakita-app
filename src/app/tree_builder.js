import * as R from 'ramda';

const prefixVenue = (s) => `q_${s}`;

const generateVenueKey = prefixVenue;

const addPairToMap = R.curry((m, pair) => m.set(R.nth(0, pair), R.nth(1, pair)));

const addVenue = R.curry((venue, treeState) =>
  addPairToMap(treeState, R.pair(generateVenueKey(venue), venue))
);

const addArea = R.curry((area, treeState) => treeState);
const addTopic = R.curry((topic, treeState) => treeState);
const addQuestion = R.curry((question, treeState) => treeState);

export {addVenue, addArea, addTopic, addQuestion}
