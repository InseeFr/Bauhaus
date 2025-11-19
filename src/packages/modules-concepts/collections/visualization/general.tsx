import { CreationUpdateItems } from '@components/creation-update-items';
import { Row } from '@components/layout';
import { Note } from '@components/note';

import { D1, D2 } from '../../../deprecated-locales';
import { InseeOrganisationList } from '@components/business/creators-view';
import { isEmpty } from '@utils/value-utils';

interface CollectionAttribute {
	created?: string;
	modified?: string;
	creator?: string | string[];
	contributor?: string | string[];
	isValidated?: string;
	descriptionLg1?: string;
	descriptionLg2?: string;
}

interface CollectionGeneralProps {
	attr: CollectionAttribute;
	secondLang?: boolean;
}

type FieldName = 'creator' | 'contributor' | 'isValidated';

// Helper functions to render specific field types with type safety
const renderOrganisationField = (
	fieldName: 'creator' | 'contributor',
	label: string,
	value: string | string[]
): JSX.Element => {
	return (
		<li key={fieldName}>
			{label}: <InseeOrganisationList organisations={value} />
		</li>
	);
};

const renderValidationField = (
	fieldName: 'isValidated',
	label: string,
	value: string
): JSX.Element => {
	const status =
		value === 'false'
			? D1.collectionStatusProvisional
			: D1.collectionStatusValid;
	return <li key={fieldName}>{`${label}: ${status}`}</li>;
};

// Main helper function with type guards
const renderFieldItem = (
	fieldName: FieldName,
	label: string,
	attr: CollectionAttribute
): JSX.Element | null => {
	const value = attr[fieldName];

	if (isEmpty(value)) return null;

	switch (fieldName) {
		case 'creator':
		case 'contributor':
			return renderOrganisationField(fieldName, label, value as string | string[]);

		case 'isValidated':
			return renderValidationField(fieldName, label, value as string);

		default:
			// This should never happen due to FieldName type, but TypeScript needs this
			return null;
	}
};

function CollectionGeneral({ attr, secondLang }: CollectionGeneralProps) {
	const fields: readonly { name: FieldName; label: string }[] = [
		{ name: 'creator', label: D1.creatorTitle },
		{ name: 'contributor', label: D1.contributorTitle },
		{ name: 'isValidated', label: D1.isCollectionValidTitle },
	] as const;

	return (
		<>
			<Row>
				<Note
					title={D1.globalInformationsTitle}
					alone={true}
					text={
						<ul>
							<CreationUpdateItems
								creation={attr.created}
								update={attr.modified}
							/>
							{fields.map(({ name, label }) =>
								renderFieldItem(name, label, attr)
							)}
						</ul>
					}
				/>
			</Row>
			{attr.descriptionLg1 && (
				<Row>
					<Note
						text={attr.descriptionLg1}
						title={D1.descriptionTitle}
						alone={!secondLang}
					/>
					{secondLang && (
						<Note
							text={attr.descriptionLg2}
							title={D2.descriptionTitle}
							alone={false}
						/>
					)}
				</Row>
			)}
		</>
	);
}

export default CollectionGeneral;
