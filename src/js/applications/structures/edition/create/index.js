import Edition from '../component';
import D from '../../../../i18n';
import { useTitle } from '../../../../new-architecture/utils/hooks/useTitle';

const Create = () => {
	useTitle(D.structuresTitle, D.structuresCreateTitle);
	return <Edition creation={true} />;
};

export default Create;
