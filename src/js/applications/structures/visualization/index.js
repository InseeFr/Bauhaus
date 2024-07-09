import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Note } from '@inseefr/wilco';
import { Loading } from 'js/new-architecture/components/loading/loading';
import { useSelector } from 'react-redux';
import {
	CheckSecondLang,
	Stores,
	PageTitleBlock,
	useTitle,
	CreationUpdateItems,
	ErrorBloc,
} from 'js/utils';
import Components from './components';
import { D1, D2 } from 'js/i18n';
import StructureVisualizationControl from '../components/structure-visualization/controls';
import D from '../i18n/build-dictionary';
import StructureAPI from '../apis/structure-api';
import MainDictionary from 'js/i18n/build-dictionary';
import { DisseminationStatusVisualisation } from '../../../utils/dissemination-status/disseminationStatus';
import { ContributorsVisualisation } from '../../../utils/contributors/contributors';
import { PublicationFemale } from '../../../new-architecture/components';

export const StructureView = ({
	secondLang,
	structure,
	publish,
	serverSideError,
}) => {
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
							<li>
								{D1.processusTitle} : {structure.isRequiredBy}
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
const Structure = () => {
	const { structureId } = useParams();
	const [structure, setStructure] = useState({});
	const [loading, setLoading] = useState(true);
	const [serverSideError, setServerSideError] = useState();
	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);

	useEffect(() => {
		StructureAPI.getStructure(structureId)
			.then((res) => setStructure(res))
			.finally(() => setLoading(false));
	}, [structureId]);

	const publish = () => {
		setLoading(true);
		setServerSideError();
		return StructureAPI.publishStructure(structure)
			.then(() => StructureAPI.getStructure(structure.id))
			.then((component) => setStructure(component))
			.finally(() => setLoading(false))
			.catch((error) => {
				setServerSideError(error);
			});
	};

	if (loading) {
		return <Loading />;
	}

	return (
		<StructureView
			structure={structure}
			secondLang={secondLang}
			publish={publish}
			serverSideError={serverSideError}
		/>
	);
};

export default Structure;
