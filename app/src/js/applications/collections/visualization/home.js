import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { PageTitle, PageSubtitle } from '@inseefr/wilco';
import CollectionVisualizationControls from './controls';
import CollectionGeneral from './general';
import CollectionMembers from './members';
import { propTypes as generalPropTypes } from 'js/utils/collections/general';
import { propTypes as membersPropTypes } from 'js/utils/collections/members';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';
import { CheckSecondLang, withTitle } from 'bauhaus-utilities';
import D from 'js/i18n';

class CollectionVisualization extends Component {
	constructor(props) {
		super(props);
		this.handleClickValid = () => {
			this.props.validateCollection(this.props.id);
		};
	}

	render() {
		const { id, permission, general, members, secondLang, langs } = this.props;
		const { isValidated, creator } = general;

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
						handleValidation={this.handleClickValid}
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
}

CollectionVisualization.propTypes = {
	id: PropTypes.string, // not available for creation
	permission: permissionOverviewPropTypes.isRequired,
	secondLang: PropTypes.bool.isRequired,
	general: generalPropTypes.isRequired,
	members: membersPropTypes.isRequired,
	stampList: PropTypes.array.isRequired,
	validateCollection: PropTypes.func.isRequired,
	langs: PropTypes.object.isRequired,
};

export default withTitle(CollectionVisualization, D.collectionsTitle, props => props.general.prefLabelLg1);
