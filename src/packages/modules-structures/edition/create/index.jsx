import { useTitle } from '@utils/hooks/useTitle';

import D from '../../../deprecated-locales';
import Edition from '../component';

export const Component = () => {
	useTitle(D.structuresTitle, D.structuresCreateTitle);
	return <Edition creation={true} />;
};
