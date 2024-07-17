import { emptyWithContributor as emptyGeneral } from './general';

const emptyCollection = (defaultContributor) => ({
	general: emptyGeneral(defaultContributor),
	members: [],
});

export default emptyCollection;
