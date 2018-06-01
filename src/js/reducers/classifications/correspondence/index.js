import { getGeneral } from './general';
import { getAssociations } from './associations';

export function getCorrespondence(state, id) {
	const correspondence = getGeneral(
		state.classificationsCorrespondenceGeneral,
		id
	);
	//if (!correspondence) return;
	const associations = getAssociations(
		state.classificationsCorrespondenceAssociations,
		id
	);
	//	if (!associations) return;
	return {
		correspondence,
		associations,
	};
}
