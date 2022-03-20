import { createArrayRef, createRef } from 'fp/ref';

/**
 * @typedef {object} AskerStores
 * @property {object} performParse
*/

/**
 * @type AskerStores
 */
export const AskerStores = {
  performParse: createRef(),
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
