import takeKeys from 'js/utils/take-keys';

const generalFieldsToKeepCreate = [
	'id',
	'prefLabelLg1',
	'prefLabelLg2',
	'creator',
	'contributor',
	'descriptionLg1',
	'descriptionLg2',
];

const generalFieldsToKeepUpdate = [
	'id',
	'prefLabelLg1',
	'prefLabelLg2',
	'created',
	'creator',
	'contributor',
	'descriptionLg1',
	'descriptionLg2',
];

function processGeneral(general, keys) {
	const extract = takeKeys(keys);
	general = extract(general);
	return general;
}

function processMembers(members) {
	return members.reduce((ids, { id, label }) => {
		ids.push(id);
		return ids;
	}, []);
}

export default function buildPayload(collection, action) {
	let general;
	if (action === 'CREATE')
		general = processGeneral(collection.general, generalFieldsToKeepCreate);
	else general = processGeneral(collection.general, generalFieldsToKeepUpdate);
	const members = processMembers(collection.members);

	return {
		...general,
		members,
	};
}
