import { nbResults } from '../../utils/array-utils';
import D from '../../i18n/build-dictionary';

export default ({ results }) => nbResults(results, D.results, D.result);
