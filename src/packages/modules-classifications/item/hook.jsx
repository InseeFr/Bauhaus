import { useQuery } from '@tanstack/react-query';

import { ClassificationsApi } from '@sdk/classification';

import { range } from '../../utils/array-utils';
import { emptyNotes } from '../utils/item/notes';

const useClassificationItem = (classificationId, itemId, current) => {
	const {
		isLoading,
		isPreviousData,
		data: item,
	} = useQuery({
		queryKey: ['classifications-item', classificationId, itemId],
		queryFn: async () => {
			const [general, narrowers] = await Promise.all([
				ClassificationsApi.getClassificationItemGeneral(
					classificationId,
					itemId,
				),
				ClassificationsApi.getClassificationItemNarrowers(
					classificationId,
					itemId,
				),
			]);

			let notes = [];
			if (general.conceptVersion) {
				notes = await Promise.all(
					range(1, Number(general.conceptVersion) + 1).map((version) => {
						return ClassificationsApi.getClassificationItemNotes(
							classificationId,
							itemId,
							version,
						).then((note) => {
							return {
								version,
								...emptyNotes,
								...note,
							};
						});
					}),
				);
			}
			const formattedNotes = notes.reduce(
				(acc, note) => ({ ...acc, [note.version]: note }),
				{},
			);
			return { general, notes: formattedNotes, narrowers };
		},
	});

	if (current) {
		return {
			isLoading,
			item: {
				general: item?.general,
				narrowers: item?.narrowers,
				notes: item?.notes?.[item?.general?.conceptVersion] ?? {},
			},
		};
	}
	return { isLoading, isPreviousData, item };
};

export default useClassificationItem;
