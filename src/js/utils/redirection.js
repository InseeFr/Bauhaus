export const goBack = (props, defaultRedirection) => () =>
	props.history.length === 1 || props.history.location.state
		? props.history.push(defaultRedirection)
		: props.history.goBack();

export const goBackOrReplace = (props, redirectUrl, shouldReplace = false) => {
	if (shouldReplace) {
		props.history.replace(redirectUrl);
	} else {
		goBack(props, redirectUrl)();
	}
};
