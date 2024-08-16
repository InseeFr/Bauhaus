//@ts-nocheck
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Note } from '@inseefr/wilco';
import {
	Loading,
	PublicationFemale,
	ContributorsVisualisation,
	DisseminationStatusVisualisation,
	ErrorBloc,
	PageTitleBlock,
	CheckSecondLang,
	CreationUpdateItems,
} from '../../components';
import { useSelector } from 'react-redux';
import Components from './components';
import { D1, D2 } from '../../deprecated-locales';
import StructureVisualizationControl from '../components/structure-visualization/controls';
import D from '../i18n/build-dictionary';
import StructureAPI from '../apis/structure-api';
import MainDictionary from '../../deprecated-locales/build-dictionary';
import { useTitle } from '../../utils/hooks/useTitle';
import { getSecondLang } from '../../redux/second-lang';
import { Structure } from '../../model/structures/Structure';

type StructureViewTypes = {
	secondLang: boolean;
	structure: Structure;
	publish: (id: string) => void;
	serverSideError: string | undefined;
};
export const StructureView = ({
	secondLang,
	structure,
	publish,
	serverSideError,
}: StructureViewTypes) => {
	useTitle(D.structuresTitle, structure?.labelLg1);
	const {
		labelLg1,
		labelLg2,
		descriptionLg1,
		descriptionLg2,
		componentDefinitions = [],
	} = structure;

	return (
		<>
			<PageTitleBlock
				secondLang={secondLang}
				titleLg1={labelLg1}
				titleLg2={labelLg2}
			/>
			<CheckSecondLang />
			<StructureVisualizationControl structure={structure} publish={publish} />
			{serverSideError && (
				<ErrorBloc error={serverSideError} D={MainDictionary} />
			)}
			<div className="row">
				<Note
					text={
						<ul>
							<li>
								{D1.idTitle} : {structure.identifiant}
							</li>
							<CreationUpdateItems
								creation={structure.created}
								update={structure.modified}
							/>
							<li>
								{D.componentValididationStatusTitle} :{' '}
								<PublicationFemale object={structure} />
							</li>
							<li>
								{D.creator} : {structure.creator}
							</li>
							<li>
								<ContributorsVisualisation
									contributors={structure.contributor}
								/>
							</li>
							<li>
								<DisseminationStatusVisualisation
									disseminationStatus={structure.disseminationStatus}
								/>
							</li>
						</ul>
					}
					title={D1.globalInformationsTitle}
					alone={true}
				/>
			</div>
			<div className="row">
				<Note
					title={D1.descriptionTitle}
					text={descriptionLg1}
					alone={!secondLang}
					allowEmpty={true}
				/>
				{secondLang && (
					<Note
						title={D2.descriptionTitle}
						text={descriptionLg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</div>
			<Components componentDefinitions={componentDefinitions} />
		</>
	);
};
const StructureContainer = () => {
	const { structureId } = useParams<{ structureId: string }>();
	const [structure, setStructure] = useState<Structure>({} as Structure);
	const [loading, setLoading] = useState(true);
	const [serverSideError, setServerSideError] = useState<string | undefined>();
	const secondLang = useSelector((state) => getSecondLang(state));

	useEffect(() => {
		StructureAPI.getStructure(structureId)
			.then((res: Structure) => setStructure(res))
			.finally(() => setLoading(false));
	}, [structureId]);

	const publish = () => {
		setLoading(true);
		setServerSideError(undefined);
		return StructureAPI.publishStructure(structure)
			.then(() => StructureAPI.getStructure(structure.id))
			.then((structure: Structure) => setStructure(structure))
			.finally(() => setLoading(false))
			.catch((error: any) => {
				setServerSideError(error);
			});
	};

	if (loading) {
		return <Loading />;
	}

	return (
		<StructureView
			structure={structure}
			secondLang={secondLang!}
			publish={publish}
			serverSideError={serverSideError}
		/>
	);
};

export default StructureContainer;
