import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loading-overlay';
import { dictionary } from 'js/utils/dictionary';
import * as select from 'js/reducers';
import Dashboard from './home';
import loadConceptSearchList from 'js/actions/concepts/search-list';
import 'css/app.css';

class DashboardContainer extends Component {
	componentWillMount() {
		const { conceptSearchList } = this.props;
		if (!conceptSearchList) this.props.loadConceptSearchList();
	}

	render() {
		const { conceptSearchList } = this.props;

		if (!conceptSearchList)
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

		return <Dashboard conceptSearchList={conceptSearchList} />;
	}
}

const mapStateToProps = state => ({
	conceptSearchList: select.getConceptSearchList(state),
});
const mapDispatchToProps = {
	loadConceptSearchList,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
