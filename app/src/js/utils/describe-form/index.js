import describeHandlers from './describe-handlers';
import buildExtractFields from './extract-fields';

export const buildPropertyHandler = propertyName => setState => value =>
	setState({ [propertyName]: value });

export default function describeForm(fields) {
	return {
		handlersFromSetState: describeHandlers(fields),
		extractFields: buildExtractFields(fields),
	};
}
