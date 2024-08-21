import Edition from '../component';
import D from '../../../deprecated-locales';
import { useTitle } from '../../../utils/hooks/useTitle';

const Create = () => {
	useTitle(D.structuresTitle, D.structuresCreateTitle);
	return <Edition creation={true} />;
};

export default Create;
