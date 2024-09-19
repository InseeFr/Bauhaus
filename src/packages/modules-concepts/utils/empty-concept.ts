import { emptyWithContributor as emptyGeneral } from './general';
import { fields as noteFields } from './notes';
import objectFromKeys from '../../utils/object-from-keys';

const emptyConcept = (defaultContributor: any) => ({
	general: emptyGeneral(defaultContributor),
	links: [],
	notes: objectFromKeys(noteFields, ''),
});

export default emptyConcept;
