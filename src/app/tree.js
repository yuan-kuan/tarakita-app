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

const trimToParentId = R.pipe(
  R.split(/[.]/),
  R.head,
  R.replace(/>(?!.*>)/, '.')
);

const intTo0padded = (n) => n.toString().padStart(2, '0'); 
const incrementString = R.compose(intTo0padded, R.inc, parseInt)

const incrementId =
  R.pipe(
    R.split('.'),
    R.over(R.lensIndex(1), incrementString),
    R.join('.'),
  );

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

const getNextSibling = (id) =>
  free.of(id)
    .map(incrementId)
    .chain(db.get)

const hasNextSibling = (id) =>
  free.of(id)
    .chain(getNextSibling)
    .call(free.bichain(
      R.always(free.of(false)),
      R.always(free.of(true)),
    ))

const findParent = (id) =>
  free.of(id)
    .map(trimToParentId)
    .chain(db.get)
  
const findChildren = (id) =>
  free.of(id)
    .map(convertToParentId)
    .map(makeFindChildrenOption)
    .chain(db.allDocs)

const findRoots = () =>
  free.of(makeFindRootQuery())
    .chain(db.find);

export {findRoots, findChildren, findParent, hasNextSibling, getNextSibling };
