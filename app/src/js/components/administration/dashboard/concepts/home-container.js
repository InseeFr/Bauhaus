import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Loading } from 'bauhaus-library';
import * as select from 'js/reducers';
import Dashboard from './home';
import loadConceptSearchList from 'js/actions/concepts/search-list';
import loadCollectionDashboardList from 'js/actions/dashboard/collections';

class DashboardContainer extends Component {
	componentWillMount() {
		const { conceptSearchList, collectionDashboardList } = this.props;
		if (!conceptSearchList) this.props.loadConceptSearchList();
		if (!collectionDashboardList) this.props.loadCollectionDashboardList();
	}

	render() {
		const { conceptSearchList, collectionDashboardList } = this.props;
		if (!conceptSearchList || !collectionDashboardList) return <Loading />;

		return (
			<Dashboard
				conceptsData={conceptSearchList}
				collectionsData={collectionDashboardList}
			/>
		);
	}
}

const mapStateToProps = state => ({
	conceptSearchList: select.getConceptSearchList(state),
	collectionDashboardList: select.getCollectionDashboardList(state),
});
const mapDispatchToProps = {
	loadConceptSearchList,
	loadCollectionDashboardList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DashboardContainer);
