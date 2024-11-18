import Edition from '../component';
import D from '../../../deprecated-locales';
import { useTitle } from '@utils/hooks/useTitle';

export const Component = () => {
	useTitle(D.structuresTitle, D.structuresCreateTitle);
	return <Edition creation={true} />;
};
