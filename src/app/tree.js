import * as R from 'ramda';
import * as free from 'fp/free';
import * as db from 'app/database';
import { tapLog } from './utils';

const L = {
  startKey: R.lensProp('startkey'),
  endKey: R.lensProp('endkey'),
  keys: R.lensProp('keys'),
  includeDoc: R.lensProp('include_docs'),
  typeSelector: R.lensPath(['selector', 'type', '$eq']),
  value: R.lensProp('value'),
  type: R.lensProp('type'),
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
const incrementString = R.compose(intTo0padded, R.inc, parseInt);

const incrementId = R.pipe(
  R.split(leafDot),
  R.over(R.lensIndex(1), incrementString),
  R.join(leafDot)
);

const makeFindChildrenOption = (id) =>
  R.pipe(
    R.set(L.startKey, `${id}${leafDot}`),
    R.set(L.endKey, `${id}${leafDot}\ufff0`),
    R.set(L.includeDoc, true)
  )({});

const makeFindRootQuery = () => R.pipe(R.set(L.typeSelector, 'venue'))({});

const makeAllDocKeysOption = (ids) =>
  R.pipe(R.set(L.keys, ids), R.set(L.includeDoc, true))({});

const hasSubtopic = (id) =>
  free
    .of(id)
    .chain(findChildren)
    .map(R.head)
    .map(R.view(L.type))
    .map(R.equals('subtopic'));

const getQuestion = (id) => free.of(id).chain(db.get).map(R.view(L.value));

const orderOf = (id) => R.pipe(
    R.split(leafDot),
    R.view(R.lensIndex(1)),
    parseInt,
  )(id)

const typeOf = (id) => free.of(id).chain(db.get).map(R.view(L.type));

const getNextSibling = (id) => free.of(id).map(incrementId).chain(db.get);

const hasNextSibling = (id) =>
  free
    .of(id)
    .chain(getNextSibling)
    .call(free.bichain(R.always(free.of(false)), R.always(free.of(true))));

const findParent = (id) => free.of(id).map(trimToParentId).chain(db.get);

const findChildren = (id) =>
  free
    .of(id)
    .map(convertToParentId)
    .map(makeFindChildrenOption)
    .chain(db.allDocs);

const findRoots = () => free.of(makeFindRootQuery()).chain(db.find);

const getAncestors = (id) =>
  free
    .of(id)
    .map(
      R.unfold((i) => {
        const parentId = trimToParentId(i);
        return i == parentId ? false : [parentId, parentId];
      })
    )
    .map(R.reverse)
    .map(makeAllDocKeysOption)
    .chain(db.allDocs);

export {
  findRoots,
  findChildren,
  findParent,
  hasNextSibling,
  getNextSibling,
  typeOf,
  getQuestion,
  orderOf,
  hasSubtopic,
  getAncestors,
};
