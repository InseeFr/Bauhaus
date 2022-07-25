/**
 * Utily function to build event handlers to be used within a form
 *
 * In most cases, `setState` will be build with `this.setState.bind(this)`.
 *
 * @export
 * @param {array} fields field names exposed within the form
 * @returns {function} a function which given a function to set state returns a
 * collection of handlers, with one key per field name
 */
export default function describeHandlers(fields) {
	// `setState` will be assigned with the returned function
	let futureSetState;
	const handlersValue = fields.reduce((handlers, field) => {
		handlers[field] = value => futureSetState({ [field]: value });
		return handlers;
	}, {});
	return setState => {
		futureSetState = setState;
		return handlersValue;
	};
}
