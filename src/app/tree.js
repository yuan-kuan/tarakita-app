import * as R from 'ramda';
import * as free from 'fp/free';
import * as db from 'app/database';

const L = {
  startKey: R.lensProp('startkey'), 
  endKey: R.lensProp('endkey'),
  includeDoc: R.lensProp('include_docs'),
  typeSelector: R.lensPath(['selector', 'type', '$eq']),
};

const convertToParentId = R.replace(/[.]/, '>');

const makeFindChildrenOption = (id) =>
  R.pipe(
    R.set(L.startKey, `${id}.`),
    R.set(L.endKey, `${id}.\ufff0`),
    R.set(L.includeDoc, true)
  )({}); 

const makeFindRootQuery = () =>
  R.pipe(
    R.set(L.typeSelector, 'venue'),
  )({});
  
const findChildren = (id) =>
  free.of(id)
    .map(convertToParentId)
    .map(makeFindChildrenOption)
    .chain(db.allDocs)

const findRoots = () =>
  free.of(makeFindRootQuery())
    .chain(db.find);

export {findRoots, findChildren};
