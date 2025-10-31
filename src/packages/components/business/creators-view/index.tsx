import { Note } from '@components/note';
import { useV2StampsMap } from '../../../utils/hooks/stamps';
import { D1 } from '../../../modules-operations/i18n/build-dictionary';
import { List } from '../../ui/list';

interface CreatorsViewTypes {
	creators?: string | string[];
	render: (creators: string[]) => React.ReactNode;
}

const InseeOrganisationProvider = ({ creators, render }: CreatorsViewTypes) => {
	const stampsMap = useV2StampsMap();

	const getCreatorLabel = (value: string): string => {
		return stampsMap.get(value) ?? value;
	};

	if (!creators || (Array.isArray(creators) && creators.length === 0)) {
		return <>{render([])}</>;
	}

	const creatorsArray = Array.isArray(creators) ? creators : [creators];

	return <>{render(creatorsArray.map(getCreatorLabel))}</>;
};

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
		<InseeOrganisationProvider
			creators={organisations}
			render={(response) => (
				<List<string>
					items={response}
					getContent={(item) => item}
					getKey={(item) => item}
				/>
			)}
		/>
	);
};

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
		<InseeOrganisationProvider
			creators={organisations}
			render={(response) => response[0]}
		/>
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
		<InseeOrganisationProvider
			creators={organisationsArray}
			render={(response) => {
				const text =
					organisationsArray.length === 1 ? (
						<p>{response[0]}</p>
					) : (
						<List<string>
							items={organisationsArray}
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
		/>
	);
};