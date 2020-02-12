import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Loading } from '@inseefr/wilco';
import AssociationHome from './home';
import loadCorrespondenceAssociation from 'js/actions/classifications/correspondences/association';
import { saveSecondLang } from 'js/actions/app';
import * as select from 'js/reducers/classifications/correspondence/association';
import * as mainSelect from 'js/reducers';
import buildExtract from '@inseefr/wilco/src/utils/build-extract';
import { getSecondLang } from 'js/reducers/app';

const extractCorrespondenceId = buildExtract('correspondenceId');
const extractAssociationId = buildExtract('associationId');

class AssociationHomeContainer extends Component {
	componentWillMount() {
		const { association, correspondenceId, associationId } = this.props;
		if (!association) {
			this.props.loadCorrespondenceAssociation(correspondenceId, associationId);
		}
	}
	render() {
		const { association, secondLang, saveSecondLang, langs } = this.props;
		if (!association) return <Loading />;
		return (
			<AssociationHome
				association={association}
				secondLang={secondLang}
				saveSecondLang={saveSecondLang}
				langs={langs}
			/>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const correspondenceId = extractCorrespondenceId(ownProps);
	const associationId = extractAssociationId(ownProps);
	const association = select.getAssociation(
		state,
		correspondenceId,
		associationId
	);
	const secondLang = getSecondLang(state);
	const langs = mainSelect.getLangs(state);
	return {
		correspondenceId,
		associationId,
		association,
		secondLang,
		langs,
	};
};

const mapDispatchToProps = {
	loadCorrespondenceAssociation,
	saveSecondLang,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AssociationHomeContainer);
