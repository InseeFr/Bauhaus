import * as A from 'js/actions/constants';
import { LOADING, LOADED } from 'js/constants';

export default function(state = {}, action) {
  const { type, payload } = action;
  switch (type) {
    //TODO don't load twice the same resource
    case A.LOAD_NOTES_VERSION:
      const { id, version } = payload;
      const otherVersions = state[id];
      return {
        ...state,
        [id]: {
          ...otherVersions,
          [version]: {
            status: LOADING,
          },
        },
      };
    case A.LOAD_NOTES_VERSION_SUCCESS: {
      const { id, version, results } = payload;
      const otherVersions = state[id];
      return {
        ...state,
        [id]: {
          //on conserve les versions déjà chargées
          ...otherVersions,
          //on ajoute la nouvelle version
          [version]: {
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

export const getNotes = (state, conceptId, conceptVersion) => {
  const allNotes = state[conceptId];
  if (!allNotes) return null;
  const versionNotes = allNotes[conceptVersion];
  return versionNotes && versionNotes.results;
};
