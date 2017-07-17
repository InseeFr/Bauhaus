import describeHandlers from './describe-handlers';
import buildExtractFields from './extract-fields';

export const buildPropertyHandler = propertyName => setState => value =>
  setState({ [propertyName]: value });

//TODO check if `describeForm` is still in use and remove it if is not
export default function describeForm(fields) {
  return {
    handlersFromSetState: describeHandlers(fields),
    extractFields: buildExtractFields(fields),
  };
}
