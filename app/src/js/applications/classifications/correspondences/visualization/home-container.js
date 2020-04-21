import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Loading, buildExtract } from '@inseefr/wilco';
import HomeGeneral from './home-general';
import HomeAssociations from './home-associations';
import { getCorrespondence } from 'js/reducers/classifications/correspondence';
import loadCorrespondenceGeneral from 'js/actions/classifications/correspondences/general';
import loadCorrespondenceAssociations from 'js/actions/classifications/correspondences/associations';
import * as select from 'js/reducers';
import { Stores } from 'bauhaus-utilities';

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
		if (!correspondence) return <Loading />;
		if (correspondence && !associations)
			return (
				<div className="container">
					<HomeGeneral
						correspondence={correspondence}
						secondLang={secondLang}
						langs={langs}
					/>
					<Loading />
				</div>
			);
		return (
			<div className="container">
				<HomeGeneral
					correspondence={correspondence}
					secondLang={secondLang}
					langs={langs}
				/>
				<HomeAssociations
					id={id}
					associations={associations}
					correspondence={correspondence}
					secondLang={secondLang}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const { correspondence, associations } = getCorrespondence(state, id);
	const secondLang = Stores.SecondLang.getSecondLang(state);
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
	loadCorrespondenceGeneral,
	loadCorrespondenceAssociations,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CorrespondencesHomeContainer);
