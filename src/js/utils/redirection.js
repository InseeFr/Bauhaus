export const goBack = (props, defaultRedirection) => () =>
	props.history.length === 1 || props.history.location.state
		? props.history.push(defaultRedirection)
		: props.history.goBack();
