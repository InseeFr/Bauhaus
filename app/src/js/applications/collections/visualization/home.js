import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { PageTitle, PageSubtitle, Loading } from '@inseefr/wilco';
import CollectionVisualizationControls from './controls';
import CollectionGeneral from './general';
import CollectionMembers from './members';
import { propTypes as generalPropTypes } from 'js/utils/collections/general';
import { propTypes as membersPropTypes } from 'js/utils/collections/members';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';
import { CheckSecondLang, withTitle } from 'bauhaus-utilities';
import D from 'js/i18n';

const CollectionVisualization = ({ id, permission, general, members, secondLang, langs, validateCollection }) => {
	const { isValidated, creator } = general;
	const [exporting, setExporting] = useState(false);

	const handleClickValid = () => {
		validateCollection(id);
	};

	if(exporting) return <Loading textType="exporting" />;

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
}

CollectionVisualization.propTypes = {
	id: PropTypes.string,
	permission: permissionOverviewPropTypes.isRequired,
	secondLang: PropTypes.bool.isRequired,
	general: generalPropTypes.isRequired,
	members: membersPropTypes.isRequired,
	validateCollection: PropTypes.func.isRequired,
	langs: PropTypes.object.isRequired,
};

export default withTitle(CollectionVisualization, D.collectionsTitle, props => props.general.prefLabelLg1);
