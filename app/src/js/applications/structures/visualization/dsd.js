import React, { useState, useEffect } from 'react';
import { buildExtract, Note, PageTitle, PageSubtitle } from '@inseefr/wilco';
import { useSelector } from 'react-redux';
import { CheckSecondLang } from 'bauhaus-utilities';
import Controls from './controls';
import Components from './components';
import D from 'js/i18n';
import { StructureAPI, Stores } from 'bauhaus-structures';

const DSD = props => {
	const [DSD, setDSD] = useState({});
	const secondLang = useSelector(state =>
		Stores.SecondLang.getSecondLang(state)
	);

	useEffect(() => {
		const dsdId = buildExtract('dsdId')(props);
		StructureAPI.getStructure(dsdId).then(res => setDSD(res));
	}, [props]);

	const { labelLg1, labelLg2, descriptionLg1, descriptionLg2 } = DSD;
	return (
		<>
			<PageTitle title={labelLg1} />
			{secondLang && <PageSubtitle subTitle={labelLg2} />}
			<CheckSecondLang />

			<Controls dsdId={buildExtract('dsdId')(props)} />
			<div className="row">
				{descriptionLg1 && (
					<Note
						title={D.descriptionTitle}
						text={descriptionLg1}
						alone={!secondLang}
						allowEmpty={true}
					/>
				)}
				{secondLang && (
					<Note
						title={D.descriptionTitle}
						text={descriptionLg2}
						alone={false}
						allowEmpty={true}
					/>
				)}
			</div>
			<Components />
		</>
	);
};

export default DSD;
