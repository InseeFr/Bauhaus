/**
 * @typedef Series
 * @property {String} prefLabelLg1
 * @property {String} prefLabelLg2
 */

/**
 * @typedef Indicator
 * @property {String} prefLabelLg1
 * @property {String} prefLabelLg2
 */

/**
 * @typedef Operation
 * @property {String} prefLabelLg1
 * @property {String} prefLabelLg2
 */

/**
 * @typedef {Object} Sims
 * @property {string=} id
 * @property {string=} labelLg1
 * @property {string=} labelLg2
 * @property {SimsDocuments[]=} documents
 * @property {String=} idOperation
 * @property {String=} idSeries
 * @property {String=} idIndicator
 */

/**
 * @typedef {Object} SimsDocuments
 * @property {string} uri
 * @property {string} url
 * @property {string=} updatedDate
 * @property {string} labelLg1
 * @property {string} labelLg2
 * @property {string=} lang
 * @property {string} descriptionLg1
 * @property {string} descriptionLg2
 */

export default {};
