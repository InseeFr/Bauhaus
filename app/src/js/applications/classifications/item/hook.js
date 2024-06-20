import { useQuery } from '@tanstack/react-query';
import api from '../../../remote-api/classifications-api';
import { ArrayUtils } from 'js/utils';
import { emptyNotes } from '../utils/item/notes';

const useClassificationItem = (classificationId, itemId, current) => {
	const {
		isLoading,
		isPreviousData,
		data: item,
	} = useQuery(['classifications-item', classificationId, itemId], async () => {
		const [general, narrowers] = await Promise.all([
			api.getClassificationItemGeneral(classificationId, itemId),
			api.getClassificationItemNarrowers(classificationId, itemId),
		]);

		let notes = [];
		if (general.conceptVersion) {
			notes = await Promise.all(
				ArrayUtils.range(1, Number(general.conceptVersion) + 1).map(
					(version) => {
						return api
							.getClassificationItemNotes(classificationId, itemId, version)
							.then((note) => {
								return {
									version,
									...emptyNotes,
									...note,
								};
							});
					}
				)
			);
		}
		const formattedNotes = notes.reduce(
			(acc, note) => ({ ...acc, [note.version]: note }),
			{}
		);
		return { general, notes: formattedNotes, narrowers };
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
