import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Note, Loading } from '@inseefr/wilco';
import { useSelector } from 'react-redux';
import { CheckSecondLang, Stores, PageTitleBlock } from 'bauhaus-utilities';
import Components from './components';
import { D1, D2 } from 'js/i18n';
import {
	StructureAPI,
	StructureVisualizationControl,
} from 'bauhaus-structures';

const DSD = () => {
	const { dsdId } = useParams();
	const [DSD, setDSD] = useState({});
	const [loading, setLoading] = useState(true);
	const secondLang = useSelector(state =>
		Stores.SecondLang.getSecondLang(state)
	);

	useEffect(() => {
		StructureAPI.getStructure(dsdId)
			.then(res => setDSD(res))
			.finally(() => setLoading(false));
	}, [dsdId]);

	const {
		labelLg1,
		labelLg2,
		descriptionLg1,
		descriptionLg2,
		componentDefinitions = [],
	} = DSD;

	if (loading) {
		return <Loading />;
	}

	return (
		<>
			<PageTitleBlock
				secondLang={secondLang}
				titleLg1={labelLg1}
				titleLg2={labelLg2}
			/>
			<CheckSecondLang />

			<StructureVisualizationControl structure={DSD} />
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

export default DSD;
