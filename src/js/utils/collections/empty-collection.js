import { emptyWithContributor as emptyGeneral } from './general';

export default defaultContributor => ({
	general: emptyGeneral(defaultContributor),
	members: [],
});
