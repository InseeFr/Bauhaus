import { PENDING, OK } from 'js/constants';
import {
  VALIDATE_CONCEPTS,
  VALIDATE_CONCEPTS_SUCCESS,
} from 'js/actions/concepts-to-validate';

import {
  EXPORT_CONCEPTS,
  EXPORT_CONCEPTS_SUCCESS,
} from 'js/actions/concepts-to-export';

export default function(state = { validation: OK, export: OK }, action) {
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
    default:
      return state;
  }
}
