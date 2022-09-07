import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Loading, buildExtract } from '@inseefr/wilco';
import AssociationHome from './home';
import loadCorrespondenceAssociation from 'js/actions/classifications/correspondences/association';
import * as select from 'js/reducers/classifications/correspondence/association';
import * as mainSelect from 'js/reducers';
import { Stores } from 'bauhaus-utilities';

const extractCorrespondenceId = buildExtract('correspondenceId');
const extractAssociationId = buildExtract('associationId');

const AssociationHomeContainer = ({ association, secondLang, langs, correspondenceId, associationId, loadCorrespondenceAssociation }) => {
	useEffect(() => {
		if (!association) {
			loadCorrespondenceAssociation(correspondenceId, associationId);
		}
	}, [association, loadCorrespondenceAssociation, correspondenceId, associationId, ])

	if (!association) return <Loading />;
	return (
		<AssociationHome
			association={association}
			secondLang={secondLang}
			langs={langs}
		/>
	);
}

const mapStateToProps = (state, ownProps) => {
	const correspondenceId = extractCorrespondenceId(ownProps);
	const associationId = extractAssociationId(ownProps);
	const association = select.getAssociation(
		state,
		correspondenceId,
		associationId
	);
	const secondLang = Stores.SecondLang.getSecondLang(state);
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
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AssociationHomeContainer);
