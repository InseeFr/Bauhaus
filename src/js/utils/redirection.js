export const goBack = (props, defaultRedirection) => () =>
	props.history.length === 1 || props.history.location.state
		? props.history.push(defaultRedirection)
		: props.history.goBack();

/**
 * This method is used when we have to redirect the user after creating or
 * updating an object.
 * If this is a creation, we should replace the current history with the page of the newly created object.
 * If this is an update, we do a goBack
 *
 * @param {{history: any}} props
 * @param {string} redirectUrl
 * @param {boolean} shouldReplace
 */
export const goBackOrReplace = (props, redirectUrl, shouldReplace = false) => {
	if (shouldReplace) {
		props.history.replace(redirectUrl);
	} else {
		goBack(props, redirectUrl)();
	}
};
