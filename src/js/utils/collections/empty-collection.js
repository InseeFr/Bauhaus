import { emptyWithContributor as emptyGeneral } from './general';

export default function emptyCollection() {
	return {
		general: emptyGeneral(),
		members: [],
	};
}
