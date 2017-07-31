import loadLinks from './links';
import loadNotes from './notes-version';
import loadGeneral from './general';

export default id => dispatch => {
  //handy to return a promise in case we want to chain other actions
  return Promise.all([
    dispatch(loadGeneral(id)).then(({ conceptVersion }) =>
      dispatch(loadNotes(id, conceptVersion))
    ),
    dispatch(loadLinks(id)),
  ]);
};
