import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loading from 'js/components/shared/loading';
import * as select from 'js/reducers';
import ConceptSearchList from './home';
import loadStampList from 'js/actions/stamp';
import loadDisseminationStatusList from 'js/actions/dissemination-status';
import loadConceptSearchList from 'js/actions/concepts/search-list';

class ConceptSearchListContainer extends Component {
	componentWillMount() {
		const {
			conceptSearchList,
			stampList,
			disseminationStatusList,
		} = this.props;
		if (!conceptSearchList) this.props.loadConceptSearchList();
		if (!stampList) this.props.loadStampList();
		if (!disseminationStatusList) this.props.loadDisseminationStatusList();
	}

	render() {
		const {
			conceptSearchList,
			stampList,
			disseminationStatusList,
		} = this.props;

		if (!(conceptSearchList && stampList && disseminationStatusList))
			return <Loading textType="loading" context="concepts" />;

		return (
			<ConceptSearchList
				conceptSearchList={conceptSearchList}
				stampList={stampList}
				disseminationStatusList={disseminationStatusList}
			/>
		);
	}
}

const mapStateToProps = state => ({
	conceptSearchList: select.getConceptSearchList(state),
	stampList: select.getStampList(state),
	disseminationStatusList: select.getDisseminationStatusList(state),
});
const mapDispatchToProps = {
	loadConceptSearchList,
	loadStampList,
	loadDisseminationStatusList,
};

export default connect(mapStateToProps, mapDispatchToProps)(
	ConceptSearchListContainer
);
