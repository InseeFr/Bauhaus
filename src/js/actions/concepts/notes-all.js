import { range } from 'js/utils/array-utils';
import * as A from '../constants';
import loadNotesVersion from './notes-version';

export default (id, lastVersion) => dispatch => {
  dispatch({
    type: A.LOAD_NOTES_ALL,
    id,
    lastVersion,
  });
  return Promise.all(
    range(1, lastVersion).map(version =>
      dispatch(loadNotesVersion(id, version))
    )
  ).then(
    results =>
      dispatch({
        type: A.LOAD_NOTES_ALL_SUCCESS,
        id,
        lastVersion,
      }),
    err => dispatch({ type: A.LOAD_NOTES_ALL_FAILURE, id, lastVersion, err })
  );
};
