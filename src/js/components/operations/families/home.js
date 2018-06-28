import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageTitle from 'js/components/shared/page-title';
import SearchRmes from 'js/components/shared/search-rmes';
import D from 'js/i18n';

class FamiliesHome extends Component {
	render() {
		const { families } = this.props;
		return (
			<div>
				<div className="container">
					<div className="row">
						<div className="col-md-8 col-md-offset-2 centered">
							<PageTitle
								title={D.familiesSearchTitle}
								col={12}
								offset={0}
								context="operations"
							/>
							<SearchRmes
								items={families}
								childPath="operations/family"
								context="operations"
								label="prefLabelLg1"
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

FamiliesHome.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		}).isRequired
	),
};

export default FamiliesHome;
