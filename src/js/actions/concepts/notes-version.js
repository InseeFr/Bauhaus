import api from 'js/remote-api/api';
import buildAsyncAction from '../utils/build-async-action';
import { rmesHtmlToRawHtml } from 'js/utils/html';
import * as A from '../constants';

export default buildAsyncAction(
  api.getNoteVersionList,
  [
    A.LOAD_NOTES_VERSION,
    A.LOAD_NOTES_VERSION_SUCCESS,
    A.LOAD_NOTES_VERSION_FAILURE,
  ],
  (id, version) => ({ id, version }),
  //process response (json)
  (id, version) => notes =>
    Object.keys(notes).reduce((formatted, noteName) => {
      formatted[noteName] = rmesHtmlToRawHtml(notes[noteName]);
      return formatted;
    }, {})
);
