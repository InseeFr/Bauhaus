import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchRmes from 'js/components/shared/search-rmes';
import { dictionary } from 'js/utils/dictionary';
import '../operations.css';

class FamilliesHome extends Component {
	render() {
		const { famillies } = this.props;
		return (
			<div>
				<div className="container">
					<div className="row">
						<div className="col-md-8 col-md-offset-2 centered">
							<h2 className="page-title-operations">
								{dictionary.operations.famillies.title} - Recherche
							</h2>
							<SearchRmes
								items={famillies}
								childPath="family"
								context="operations"
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

FamilliesHome.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		}).isRequired
	),
};

export default FamilliesHome;
