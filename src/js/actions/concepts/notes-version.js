import api from 'js/remote-api/api';
import buildAsyncAction from '../utils/build-async-action';
import * as A from '../constants';

export default buildAsyncAction(
  api.getNoteVersionList,
  [
    A.LOAD_NOTES_VERSION,
    A.LOAD_NOTES_VERSION_SUCCESS,
    A.LOAD_NOTES_VERSION_FAILURE,
  ],
  (id, version) => ({ id, version })
);
