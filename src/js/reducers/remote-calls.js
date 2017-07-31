import { PENDING, OK } from 'js/constants';
import {
  VALIDATE_CONCEPT_LIST,
  VALIDATE_CONCEPT_LIST_SUCCESS,
  EXPORT_CONCEPT,
  EXPORT_CONCEPT_SUCCESS,
  CREATE_CONCEPT,
  CREATE_CONCEPT_SUCCESS,
  UPDATE_CONCEPT,
  UPDATE_CONCEPT_SUCCESS,
} from 'js/actions/constants';

/**
 * Reducer to keep track of POST and PUT calls
 * 
 * Handles a status variable which can be valued to wait until the action
 * has been processed to rediret the user.
 * 
 * @export
 * @param {object} state
 * @param {object} action 
 * @returns {object}
 */
export default function(
  state = { validation: OK, export: OK, creation: OK, update: OK },
  action
) {
  switch (action.type) {
    case VALIDATE_CONCEPT_LIST:
      return {
        ...state,
        validation: PENDING,
      };
    case VALIDATE_CONCEPT_LIST_SUCCESS:
      return {
        ...state,
        validation: OK,
      };
    case EXPORT_CONCEPT:
      return {
        ...state,
        export: PENDING,
      };
    case EXPORT_CONCEPT_SUCCESS:
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
