import describeHandlers from './describe-handlers';
import buildExtractFields from './extract-fields';
export default function describeForm(fields) {
	return {
		handlersFromSetState: describeHandlers(fields),
		extractFields: buildExtractFields(fields),
	};
}
