import api from 'js/remote-api/api';
import buildAsyncAction from '../utils/build-async-action';
import * as A from '../constants';
import { sortArray } from 'js/utils/array-utils';

const sortByLabel = sortArray('label');

export default buildAsyncAction(
  api.getConceptList,
  [
    A.LOAD_CONCEPT_LIST,
    A.LOAD_CONCEPT_LIST_SUCCESS,
    A.LOAD_CONCEPT_LIST_FAILURE,
  ],
  null,
  //process response
  () => results => {
    return sortByLabel(results);
  }
);
