import { emptyWithContributor as emptyGeneral } from './general';
import { fields as noteFields } from './notes';
import objectFromKeys from 'js/utils/object-from-keys';

export default function emptyConcept() {
	return {
		general: emptyGeneral(),
		links: [],
		notes: objectFromKeys(noteFields, ''),
	};
}
