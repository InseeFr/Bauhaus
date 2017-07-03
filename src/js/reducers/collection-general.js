import { LOAD_COLLECTION_GENERAL_SUCCESS } from '../actions/collection'

export default function (state={}, action) {
  const { type, payload } = action
  switch (type) {
    case LOAD_COLLECTION_GENERAL_SUCCESS: {
      const { id, results } = payload
      return {
        ...state,
        [id]: results
      }
    }
    default:
      return state
  }
}
