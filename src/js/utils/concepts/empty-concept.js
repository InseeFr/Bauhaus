import { emptyWithContributor as emptyGeneral } from './general';
import { fields as noteFields } from './notes';
import objectFromKeys from 'js/utils/object-from-keys';

export default defaultContributor => ({
	general: emptyGeneral(defaultContributor),
	links: [],
	notes: objectFromKeys(noteFields, ''),
});
