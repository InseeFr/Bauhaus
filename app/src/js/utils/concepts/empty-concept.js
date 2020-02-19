import { emptyWithContributor as emptyGeneral } from './general';
import { fields as noteFields } from './notes';
import { objectFromKeys } from '@inseefr/wilco';

export default defaultContributor => ({
	general: emptyGeneral(defaultContributor),
	links: [],
	notes: objectFromKeys(noteFields, ''),
});
