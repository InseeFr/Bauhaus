import api from 'js/remote-api/api';
import buildAsyncAction from '../utils/build-async-action';
import * as A from '../constants';

import { sortArray } from 'js/utils/array-utils';

const sortByLabel = sortArray('label');

const emptyItem = {
  label: '',
  creator: '',
  created: '',
  modifed: '',
  disseminationStatus: '',
  definition: '',
  validationStatus: '',
};
export default buildAsyncAction(
  api.getConceptSearchList,
  [
    A.LOAD_CONCEPT_SEARCH_LIST,
    A.LOAD_CONCEPT_SEARCH_LIST_SUCCESS,
    A.LOAD_CONCEPT_SEARCH_LIST_FAILURE,
  ],
  null,
  //process response
  () => results => {
    return sortByLabel(results).map(concept =>
      Object.assign({}, emptyItem, concept)
    );
  }
);
