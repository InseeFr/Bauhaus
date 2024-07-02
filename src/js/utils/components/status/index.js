import D from '../../i18n/build-dictionary';

export function PublicationMale({ object }) {
	return (
		<PublicationStatus
			object={object}
			dictionary={{
				Validated: D.statusValidatedM,
				Unpublished: D.statusUnpublishedM,
				Modified: D.statusModifiedM,
			}}
		/>
	);
}

export function PublicationFemale({ object }) {
	return (
		<PublicationStatus
			object={object}
			dictionary={{
				Validated: D.statusValidatedF,
				Unpublished: D.statusUnpublishedF,
				Modified: D.statusModifiedF,
			}}
		/>
	);
}

function PublicationStatus({
	dictionary = {},
	object: { validationState = '' },
}) {
	const status = dictionary[validationState] || dictionary.Unpublished;
	return <>{status}</>;
}
