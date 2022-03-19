import * as R from 'ramda';
import * as free from 'fp/free';
import * as db from 'app/database';

const L = {
  startKey: R.lensProp('startkey'), 
  endKey: R.lensProp('endkey'),
  includeDoc: R.lensProp('include_docs'),
  typeSelector: R.lensPath(['selector', 'type', '$eq']),
};

const leafDot = '-';
const parentDot = '+';

const convertToParentId = (id) => id.replace(leafDot, parentDot);

const trimToParentId = R.pipe(
  R.split(leafDot),
  R.head,
  R.replace(/[+](?!.*[+])/, leafDot)
);

const intTo0padded = (n) => n.toString().padStart(2, '0'); 
const incrementString = R.compose(intTo0padded, R.inc, parseInt)

const incrementId =
  R.pipe(
    R.split(leafDot),
    R.over(R.lensIndex(1), incrementString),
    R.join(leafDot),
  );

const makeFindChildrenOption = (id) =>
  R.pipe(
    R.set(L.startKey, `${id}${leafDot}`),
    R.set(L.endKey, `${id}${leafDot}\ufff0`),
    R.set(L.includeDoc, true)
  )({}); 

const makeFindRootQuery = () =>
  R.pipe(
    R.set(L.typeSelector, 'venue'),
  )({});

const typeOf = (id) =>
  R.pipe(
    R.split(/[+-]/),
    R.length,
    R.cond([
      [R.equals(1), R.always('venue')],
      [R.equals(2), R.always('area')],
      [R.equals(3), R.always('topic')],
      [R.equals(4), R.always('question')],
    ])
  )(id);

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

export {findRoots, findChildren, findParent, hasNextSibling, getNextSibling, typeOf};
