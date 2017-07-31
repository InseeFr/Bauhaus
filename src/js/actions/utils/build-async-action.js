//TODO add tests
export default function buildLoadAction(remoteCall, actions, buildPayload) {
  if (
    !(
      Array.isArray(actions) &&
      actions.length === 3 &&
      actions.every(action => typeof action === 'string')
    )
  ) {
    throw new Error(
      `\buildLoadAction\` expects an array of 3 strings as its second argument, got ${actions}`
    );
  }
  if (typeof remoteCall !== 'function') {
    throw new Error(
      `\buildLoadAction\` expects a function as its first argument, got ${remoteCall}`
    );
  }
  const [load, success, failure] = actions;
  return (...args) => dispatch => {
    const payload = buildPayload && buildPayload(...args);
    dispatch({
      type: load,
      payload,
    });
    return remoteCall(...args).then(
      results => {
        dispatch({
          type: success,
          payload: {
            ...payload,
            //TODO rename results -> response
            results,
          },
        });
        //allow to chain other handlers based on results
        return results;
      },
      err =>
        dispatch({
          type: failure,
          payload: {
            ...payload,
            err,
          },
        })
    );
  };
}
