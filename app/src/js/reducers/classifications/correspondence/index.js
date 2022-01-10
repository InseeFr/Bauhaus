import { getGeneral } from './general';
import { getAssociations } from './associations';

export function getCorrespondence(state, id) {
	const correspondence = getGeneral(
		state.classificationsCorrespondenceGeneral,
		id
	);
	const associations = getAssociations(
		state.classificationsCorrespondenceAssociations,
		id
	);
	return {
		correspondence,
		associations,
	};
}

