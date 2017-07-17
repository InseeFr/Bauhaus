import {
  LOAD_CONCEPT_NOTES,
  LOAD_CONCEPT_NOTES_SUCCESS,
} from '../actions/concept';

import { LOADING, LOADED } from 'js/constants';
export default function(state = {}, action) {
  const { type, payload } = action;
  switch (type) {
    //TODO don't load twice the same resource
    case LOAD_CONCEPT_NOTES:
      return {
        ...state,
        [payload.id]: {
          status: LOADING,
        },
      };
    case LOAD_CONCEPT_NOTES_SUCCESS: {
      const { id, conceptVersion, results } = payload;
      const conceptVersions = state[id];
      return {
        ...state,
        [id]: {
          //on conserve les versions déjà chargées
          ...conceptVersions,
          //on ajoute la nouvelle version
          [conceptVersion]: {
            status: LOADED,
            results,
          },
        },
      };
    }
    default:
      return state;
  }
}
