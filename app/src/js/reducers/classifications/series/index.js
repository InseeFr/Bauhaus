import { getGeneral } from './general';
import { getMembers } from './members';

export function getSeries(state, id) {
	const general = getGeneral(state.classificationSeriesGeneral, id);
	if (!general) return;
	const members = getMembers(state.classificationSeriesMembers, id);
	if (!members) return;
	return {
		general,
		members,
	};
}
