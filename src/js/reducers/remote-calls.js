import { PENDING, OK } from 'js/constants';
import {
  VALIDATE_CONCEPTS,
  VALIDATE_CONCEPTS_SUCCESS,
} from 'js/actions/concepts-to-validate';

export default function(state = { validation: OK }, action) {
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
    default:
      return state;
  }
}
