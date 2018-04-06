import { getGeneral } from './general';
import { getMembers } from './members';

export function getFamily(state, id) {
	const general = getGeneral(state.classificationFamilyGeneral, id);
	if (!general) return;
	const members = getMembers(state.classificationFamilyMembers, id);
	if (!members) return;
	return {
		general,
		members,
	};
}
