import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loading-overlay';
import { dictionary } from 'js/utils/dictionary';
import * as select from 'js/reducers';
import Dashboard from './home';
import loadConceptSearchList from 'js/actions/concepts/search-list';
import loadCollectionDashboardList from 'js/actions/dashboard/collections';
import 'css/app.css';

class DashboardContainer extends Component {
	componentWillMount() {
		const { conceptSearchList, collectionDashboardList } = this.props;
		if (!conceptSearchList) this.props.loadConceptSearchList();
		if (!collectionDashboardList) this.props.loadCollectionDashboardList();
	}

	render() {
		const { conceptSearchList, collectionDashboardList } = this.props;
		if (!conceptSearchList || !collectionDashboardList)
			return (
				<div>
					<Loadable
						active={true}
						spinner
						text={dictionary.loadable.loading}
						color="#457DBB"
						background="grey"
						spinnerSize="400px"
					/>
				</div>
			);

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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
