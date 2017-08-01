import api from 'js/remote-api/api';
import buildAsyncAction from '../utils/build-async-action';
import * as A from '../constants';
import { sortArray } from 'js/utils/array-utils';

const sortByLabel = sortArray('label');

export default buildAsyncAction(
  api.getConceptValidateList,
  [
    A.LOAD_CONCEPT_VALIDATE_LIST,
    A.LOAD_CONCEPT_VALIDATE_LIST_SUCCESS,
    A.LOAD_CONCEPT_VALIDATE_LIST_FAILURE,
  ],
  null, // no payload
  //process response
  () => results => {
    return sortByLabel(results);
  }
);
