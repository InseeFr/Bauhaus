import { getGeneral } from './general';
import { getMembers } from './members';

export function getLevel(
	state: any,
	classificationId: string,
	levelId: string,
) {
	const general = getGeneral(
		state.classificationLevelGeneral,
		classificationId,
		levelId,
	);
	if (!general) return;
	const members = getMembers(
		state.classificationLevelMembers,
		classificationId,
		levelId,
	);
	if (!members) return;
	return {
		general,
		members,
	};
}
