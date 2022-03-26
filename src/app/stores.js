import { createArrayRef, createRef } from 'fp/ref';

/**
 * @typedef {object} AskerStores
 * @property {object} performParse
 * @property {object} performUpload
 */

/**
 * @type AskerStores
 */
export const AskerStores = {
  performParse: createRef(),
  performUpload: createRef(),
};

/**
 * @typedef {object} HomeStores
 * @property {object} venues
 * @property {object} downloadingQuestion
 * @property {object} goToVenues
 * @property {object} reset
 */

/**
 * @type HomeStores
 */
export const HomeStores = {
  venues: createRef([]),
  downloadingQuestion: createRef(),
  goToVenues: createRef([]),
  reset: createRef(),
};

/**
 * @typedef {object} OptionStores
 * @property {object} ancestors
 * @property {object} options
 * @property {object} isCompleted
 * @property {object} currentName
 * @property {object} goToOptions
 * @property {object} backToParent
 * @property {object} goToResult
 */

/**
 * @type OptionStores
 */
export const OptionStores = {
  ancestors: createRef([]),
  options: createRef([]),
  isCompleted: createRef([]),
  currentName: createRef(),
  goToOptions: createRef([]),
  backToParent: createRef(),
  goToResult: createRef(),
};

/**
 * @typedef {object} AnsweringStores
 * @property {object} ancestors
 * @property {object} question
 * @property {object} order
 * @property {object} total
 * @property {object} rating
 * @property {object} hasNext
 * @property {object} goToNext
 * @property {object} backToParent
 * @property {object} submit
 * @property {object} comment
 * @property {object} submitComment
 */

/**
 * @type AnsweringStores
 */
export const AnsweringStores = {
  ancestors: createRef([]),
  question: createRef(),
  order: createRef(),
  total: createRef(),
  rating: createRef(),
  hasNext: createRef(),
  goToNext: createRef(),
  backToParent: createRef(),
  submit: createRef(),
  comment: createRef(),
  submitComment: createRef(),
};

/**
 * @typedef {object} UserStores
 * @property {object} performRegister
 * @property {object} userName
 */

/**
 * @type UserStores
 */
export const UserStores = {
  userName: createRef(),
  performRegister: createRef(),
};

/**
 * @typedef {object} ResultStores
 * @property {object} ratio
 * @property {object} upload
 * @property {object} score
 */

/**
 * @type ResultStores
 */
export const ResultStores = {
  ratio: createRef({ answered: 2, total: 5 }),
  upload: createRef(),
  score: createRef(),
};
