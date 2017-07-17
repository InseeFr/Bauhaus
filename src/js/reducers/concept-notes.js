import { LOAD_CONCEPT_NOTES_SUCCESS } from '../actions/concept';

export default function(state = {}, action) {
  const { type, payload } = action;
  switch (type) {
    case LOAD_CONCEPT_NOTES_SUCCESS: {
      const { id, conceptVersion, results } = payload;
      const conceptVersions = state[id];
      return {
        ...state,
        [id]: {
          //on conserve les versions déjà chargées
          ...conceptVersions,
          //on ajoute la nouvelle version
          [conceptVersion]: results,
        },
      };
    }
    default:
      return state;
  }
}
