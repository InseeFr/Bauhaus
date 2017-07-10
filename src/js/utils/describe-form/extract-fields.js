/**
 * Returns a function which extracts given fields from an object and returns
 * a new object with the corresponding subset of the data.
 * 
 * Intended to be used to copy some data from the props to the state.
 * @export
 * @param {array} fields 
 * @returns {function}
 */
export default function buildExtractFields(fields) {
  return props =>
    fields.reduce((stateLike, key) => {
      stateLike[key] = props[key];
      return stateLike;
    }, {});
}
