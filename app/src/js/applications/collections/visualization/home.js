import React, { useState } from 'react';
import { PageTitle, PageSubtitle, Loading } from '@inseefr/wilco';
import CollectionVisualizationControls from './controls';
import CollectionGeneral from './general';
import CollectionMembers from './members';
import { CheckSecondLang, withTitle } from 'bauhaus-utilities';
import D from 'js/i18n';

const CollectionVisualization = ({
	id,
	permission,
	general,
	members,
	secondLang,
	langs,
	validateCollection,
}) => {
	const { isValidated, creator } = general;
	const [exporting, setExporting] = useState(false);

	const handleClickValid = () => {
		validateCollection(id);
	};

	if (exporting) return <Loading textType="exporting" />;

	return (
		<div>
			<div className="container">
				<PageTitle title={general.prefLabelLg1} />
				{secondLang && general.prefLabelLg2 && (
					<PageSubtitle subTitle={general.prefLabelLg2} />
				)}
				<CollectionVisualizationControls
					id={id}
					permission={permission}
					creator={creator}
					isValidated={isValidated === 'true'}
					handleValidation={handleClickValid}
					setExporting={setExporting}
				/>
				<CheckSecondLang />
				<CollectionGeneral
					attr={general}
					secondLang={secondLang}
					langs={langs}
				/>
				<CollectionMembers
					members={members}
					secondLang={secondLang}
					langs={langs}
				/>
			</div>
		</div>
	);
};

export default withTitle(
	CollectionVisualization,
	D.collectionsTitle,
	(props) => props.general.prefLabelLg1
);
