import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Loading } from '@inseefr/wilco';
import * as select from 'js/reducers';
import ConceptSearchList from './home';
import loadStampList from 'js/actions/stamp';
import loadConceptSearchList from 'js/actions/concepts/search-list';
import { Stores } from 'bauhaus-utilities';

class ConceptSearchListContainer extends Component {
	componentWillMount() {
		const {
			conceptSearchList,
			stampList,
			disseminationStatusList,
		} = this.props;
		if (!conceptSearchList) this.props.loadConceptSearchList();
		if (stampList.length === 0) this.props.loadStampList();
		if (!disseminationStatusList) this.props.loadDisseminationStatusList();
	}

	render() {
		const {
			conceptSearchList,
			stampList,
			disseminationStatusList,
		} = this.props;

		if (!(conceptSearchList && stampList && disseminationStatusList))
			return <Loading />;

		return (
			<ConceptSearchList
				conceptSearchList={conceptSearchList}
				stampList={stampList}
				disseminationStatusList={disseminationStatusList}
			/>
		);
	}
}

const mapStateToProps = (state) => ({
	conceptSearchList: select.getConceptSearchList(state),
	stampList: Stores.Stamps.getStampList(state),
	disseminationStatusList: Stores.DisseminationStatus.getDisseminationStatusList(state),
});
const mapDispatchToProps = {
	loadConceptSearchList,
	loadStampList,
	loadDisseminationStatusList: Stores.DisseminationStatus.loadDisseminationStatusList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ConceptSearchListContainer);
