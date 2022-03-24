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
 */

/**
 * @type HomeStores
 */
export const HomeStores = {
  venues: createRef([]),
  downloadingQuestion: createRef(),
  goToVenues: createRef([]),
};

/**
 * @typedef {object} OptionStores
 * @property {object} ancestors
 * @property {object} options
 * @property {object} currentName
 * @property {object} goToOptions
 * @property {object} backToParent
 */

/**
 * @type OptionStores
 */
export const OptionStores = {
  ancestors: createRef([]),
  options: createRef([]),
  currentName: createRef(),
  goToOptions: createRef([]),
  backToParent: createRef(),
};

/**
 * @typedef {object} AnsweringStores
 * @property {object} ancestors
 * @property {object} question
 * @property {object} rating
 * @property {object} hasNext
 * @property {object} goToNext
 * @property {object} backToParent
 * @property {object} submit
 */

/**
 * @type AnsweringStores
 */
export const AnsweringStores = {
  ancestors: createRef([]),
  question: createRef(),
  rating: createRef(),
  hasNext: createRef(),
  goToNext: createRef(),
  backToParent: createRef(),
  submit: createRef(),
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
