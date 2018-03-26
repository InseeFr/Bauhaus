import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchRmes from 'js/components/shared/search-rmes';
import D from 'js/i18n';
import '../operations.css';

class OperationsHome extends Component {
	render() {
		const { operations } = this.props;
		return (
			<div>
				<div className="container">
					<div className="row">
						<div className="col-md-8 col-md-offset-2 centered">
							<h2 className="page-title-operations">
								{D.operationsSearchTitle}
							</h2>
							<SearchRmes
								items={operations}
								childPath="operation"
								context="operations"
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

OperationsHome.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		}).isRequired
	),
};

export default OperationsHome;
