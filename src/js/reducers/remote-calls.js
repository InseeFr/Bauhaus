import { PENDING, OK } from 'js/constants';
import {
  VALIDATE_CONCEPTS,
  VALIDATE_CONCEPTS_SUCCESS,
} from 'js/actions/concepts-to-validate';

import {
  EXPORT_CONCEPTS,
  EXPORT_CONCEPTS_SUCCESS,
} from 'js/actions/concepts-to-export';

import {
  CREATE_CONCEPT,
  CREATE_CONCEPT_SUCCESS,
  UPDATE_CONCEPT,
  UPDATE_CONCEPT_SUCCESS,
} from 'js/actions/concept';
export default function(
  state = { validation: OK, export: OK, creation: OK, update: OK },
  action
) {
  switch (action.type) {
    case VALIDATE_CONCEPTS:
      return {
        ...state,
        validation: PENDING,
      };
    case VALIDATE_CONCEPTS_SUCCESS:
      return {
        ...state,
        validation: OK,
      };
    case EXPORT_CONCEPTS:
      return {
        ...state,
        export: PENDING,
      };
    case EXPORT_CONCEPTS_SUCCESS:
      return {
        ...state,
        export: OK,
      };
    case CREATE_CONCEPT:
      return {
        ...state,
        creation: PENDING,
      };
    case CREATE_CONCEPT_SUCCESS:
      return {
        ...state,
        creation: OK,
      };
    case UPDATE_CONCEPT:
      return {
        ...state,
        update: PENDING,
      };
    case UPDATE_CONCEPT_SUCCESS:
      return {
        ...state,
        update: OK,
      };
    default:
      return state;
  }
}
