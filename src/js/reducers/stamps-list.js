import { LOAD_STAMPS_LIST_SUCCESS } from '../actions/stamps'

export default function (state={}, action) {
  if (action.type === LOAD_STAMPS_LIST_SUCCESS) return action.payload.results
  return state
}
