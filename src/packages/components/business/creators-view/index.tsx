import { useMemo } from 'react';
import { Note } from '@components/note';
import { useV2StampsMap } from '../../../utils/hooks/stamps';
import { D1 } from '../../../modules-operations/i18n/build-dictionary';
import { List } from '../../ui/list';

interface OrganisationMapperProps {
	organisations?: string | string[];
	children: (mappedLabels: string[]) => React.ReactElement;
}

/**
 * Provider component that maps organisation IDs to their human-readable labels.
 * Uses the V2 stamps map to retrieve organisation names.
 * Falls back to displaying the ID if no label is found.
 */
const InseeOrganisationProvider = ({
	organisations,
	children,
}: OrganisationMapperProps) => {
	const stampsMap = useV2StampsMap();

	const mappedLabels = useMemo(() => {
		if (
			!organisations ||
			(Array.isArray(organisations) && organisations.length === 0)
		) {
			return [];
		}

		const orgArray = Array.isArray(organisations)
			? organisations
			: [organisations];

		return orgArray.map((id) => {
			const label = stampsMap.get(id);

			// Warn in development if an organisation ID is not found in the map
			if (!label && process.env.NODE_ENV === 'development') {
				console.warn(`Organisation stamp not found: ${id}`);
			}

			return label ?? id; // Fallback to ID if label not found
		});
	}, [organisations, stampsMap]);

	return <>{children(mappedLabels)}</>;
};

/**
 * @deprecated Use `Organisations` from `@components/business/organisations` instead
 */
export const InseeOrganisationList = ({
	organisations,
}: Readonly<{ organisations?: string | string[] }>) => {
	if (
		!organisations ||
		(Array.isArray(organisations) && organisations.length === 0)
	) {
		return null;
	}

	return (
		<InseeOrganisationProvider organisations={organisations}>
			{(response) => (
				<List<string>
					items={response}
					getContent={(item) => item}
					getKey={(item) => item}
				/>
			)}
		</InseeOrganisationProvider>
	);
};

/**
 * @deprecated Use `Organisation` from `@components/business/organisations` instead
 */
export const InseeOrganisationText = ({
	organisations,
}: Readonly<{ organisations?: string | string[] }>) => {
	if (
		!organisations ||
		(Array.isArray(organisations) && organisations.length === 0)
	) {
		return null;
	}

	return (
		<InseeOrganisationProvider organisations={organisations}>
			{(response) => <>{response[0]}</>}
		</InseeOrganisationProvider>
	);
};
export const InseeOrganisationNotes = ({
	organisations,
}: Readonly<{ organisations?: string | string[] }>) => {
	if (
		!organisations ||
		(Array.isArray(organisations) && organisations.length === 0)
	) {
		return (
			<Note
				text={<p></p>}
				title={D1.creatorTitle}
				alone={true}
				allowEmpty={true}
			/>
		);
	}

	const organisationsArray = Array.isArray(organisations)
		? organisations
		: [organisations];

	return (
		<InseeOrganisationProvider organisations={organisationsArray}>
			{(response) => {
				const text =
					organisationsArray.length === 1 ? (
						<p>{response[0]}</p>
					) : (
						<List<string>
							items={response}
							getContent={(item) => item}
							getKey={(item) => item}
						/>
					);

				return (
					<Note
						text={text}
						title={D1.creatorTitle}
						alone={true}
						allowEmpty={true}
					/>
				);
			}}
		</InseeOrganisationProvider>
	);
};