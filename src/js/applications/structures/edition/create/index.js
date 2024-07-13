import Edition from '../component';
import { useTitle } from '../../../../utils';
import D from '../../../../i18n';

const Create = () => {
	useTitle(D.structuresTitle, D.structuresCreateTitle);
	return <Edition creation={true} />;
};

export default Create;
