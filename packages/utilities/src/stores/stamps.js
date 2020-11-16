/**
 * Redux selectors to get stamps
 */

/**
 * Return a list of stamps : ['Stamp1', 'Stamp2']
 */
export const getStampList = (state) => state.stampList.results || ['STAMP1', 'DG75-H250'];

/**
 * Return a react-select model of stamps : [{value: 'Stamp1', label: 'Stamp1'}]
 */
export const getStampListOptions = state => getStampList(state).map(stamp => ({ value: stamp, label: stamp}))
