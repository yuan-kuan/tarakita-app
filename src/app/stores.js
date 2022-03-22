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
}

/**
 * @typedef {object} HomeStores
 * @property {object} venues
 * @property {object} goToVenues
*/

/**
 * @type HomeStores
 */
export const HomeStores = {
  venues: createRef([]),
  goToVenues: createRef([]),
}

/**
 * @typedef {object} OptionStores
 * @property {object} ancestors
 * @property {object} options
 * @property {object} goToOptions
*/

/**
 * @type OptionStores
 */
export const OptionStores = {
  ancestors: createRef([]),
  options: createRef([]),
  goToOptions: createRef([]),
}

/**
 * @typedef {object} AnsweringStores
 * @property {object} question
 * @property {object} hasNext
 * @property {object} goToNext
*/

/**
 * @type AnsweringStores
 */
export const AnsweringStores = {
  question: createRef(),
  hasNext: createRef(),
  goToNext: createRef()
}

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
}
