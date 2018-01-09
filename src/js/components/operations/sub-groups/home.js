import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchRmes from 'js/components/shared/search-rmes';
import { dictionary } from 'js/utils/dictionary';
import '../operations.css';

class SubGroupsHome extends Component {
	render() {
		const { subGroups } = this.props;
		return (
			<div>
				<div className="container">
					<div className="row">
						<div className="col-md-8 col-md-offset-2 centered">
							<h2 className="page-title-operations">
								{dictionary.operations.subGroups.title} - Recherche
							</h2>
							<SearchRmes items={subGroups} childPath="sub-group" />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

SubGroupsHome.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		}).isRequired
	),
};

export default SubGroupsHome;
