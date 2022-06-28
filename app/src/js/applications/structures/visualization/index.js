import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Note, Loading, ErrorBloc } from '@inseefr/wilco';
import { useSelector } from 'react-redux';
import {
	CheckSecondLang,
	Stores,
	PageTitleBlock,
	DateUtils,
	PublicationFemale,
	useTitle
} from 'bauhaus-utilities';
import Components from './components';
import { D1, D2 } from 'js/i18n';
import {
	StructureAPI,
	StructureVisualizationControl,
	StructuresUtils
} from 'bauhaus-structures';
import D from 'bauhaus-structures/src/i18n/build-dictionary';
import api from 'bauhaus-structures/src/apis/structure-api';

export const StructureView = ({secondLang, structure, publish, serverSideError}) => {
	useTitle(D.structuresTitle, structure?.labelLg1)
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
			<StructureVisualizationControl structure={structure} publish={publish}/>
			<ErrorBloc error={serverSideError} />
			<div className="row">
				<Note
					text={
						<ul>
							<li>
								{D1.idTitle} : {structure.identifiant}
							</li>
							<li>
								{D1.createdDateTitle} : {DateUtils.stringToDate(structure.created)}
							</li>
							<li>
								{D1.modifiedDateTitle} : {DateUtils.stringToDate(structure.modified)}
							</li>
							<li>
								{D.componentValididationStatusTitle} :{' '}
								<PublicationFemale object={structure} />
							</li>
							<li>
								{D.creator} :{' '}
								{structure.creator}
							</li>
							<li>
								{D.contributor} :{' '}
								{structure.contributor}
							</li>
							<li>
								{D.disseminationStatusTitle} :{' '}
								{StructuresUtils.getDisseminationStatus(structure.disseminationStatus)}
							</li>
							<li>
								{D1.processusTitle} :{' '}
								{structure.isRequiredBy}
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
}
const Structure = () => {
	const { dsdId } = useParams();
	const [structure, setStructure] = useState({});
	const [loading, setLoading] = useState(true);
	const [serverSideError, setServerSideError] = useState();
	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);

	useEffect(() => {
		StructureAPI.getStructure(dsdId)
			.then((res) => setStructure(res))
			.finally(() => setLoading(false));
	}, [dsdId]);

	const publish = () => {
		setLoading(true);
		setServerSideError();
		return api.publishStructure(structure)
			.then(() => api.getStructure(structure.id))
			.then(component => setStructure(component))
			.finally(() => setLoading(false))
			.catch(error => {
				setServerSideError(D['errors_' + JSON.parse(error).code])
			})
	}

	if (loading) {
		return <Loading />;
	}

	return <StructureView structure={structure} secondLang={secondLang} publish={publish} serverSideError={serverSideError}/>
};

export default Structure;
