import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loading from 'js/components/shared/loading';
import HomeGeneral from './home-general';
import HomeAssociations from './home-associations';
import { getCorrespondence } from 'js/reducers/classifications/correspondence';
import { saveSecondLang } from 'js/actions/app';
import loadCorrespondenceGeneral from 'js/actions/classifications/correspondences/general';
import loadCorrespondenceAssociations from 'js/actions/classifications/correspondences/associations';
import * as select from 'js/reducers';
import buildExtract from 'js/utils/build-extract';

const extractId = buildExtract('id');

class CorrespondencesHomeContainer extends Component {
	componentWillMount() {
		const { id, correspondence, associations } = this.props;
		if (!correspondence) {
			this.props.loadCorrespondenceGeneral(id);
		}
		if (!associations) {
			this.props.loadCorrespondenceAssociations(id);
		}
	}
	render() {
		const { id, correspondence, associations, secondLang, langs } = this.props;
		if (!correspondence)
			return <Loading textType="loading" context="classifications" />;
		if (correspondence && !associations)
			return (
				<div className="container">
					<HomeGeneral
						correspondence={correspondence}
						secondLang={secondLang}
						saveSecondLang={this.props.saveSecondLang}
						langs={langs}
					/>
					<Loading textType="loading" context="classifications" />
				</div>
			);
		return (
			<div className="container">
				<HomeGeneral
					correspondence={correspondence}
					secondLang={secondLang}
					saveSecondLang={this.props.saveSecondLang}
					langs={langs}
				/>
				<HomeAssociations id={id} associations={associations} />
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const { correspondence, associations } = getCorrespondence(state, id);
	const secondLang = state.app.secondLang;
	const langs = select.getLangs(state);
	return {
		id,
		correspondence,
		associations,
		secondLang,
		langs,
	};
};

const mapDispatchToProps = {
	saveSecondLang,
	loadCorrespondenceGeneral,
	loadCorrespondenceAssociations,
};

export default connect(mapStateToProps, mapDispatchToProps)(
	CorrespondencesHomeContainer
);
