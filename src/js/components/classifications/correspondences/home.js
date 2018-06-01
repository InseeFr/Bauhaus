import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageTitle from 'js/components/shared/page-title';
import SearchRmes from 'js/components/shared/search-rmes';
import D from 'js/i18n';
import '../classifications.css';

class CorrespondencesHome extends Component {
	render() {
		const { correspondences } = this.props;
		return (
			<div>
				<div className="container">
					<div className="row">
						<div className="col-md-8 col-md-offset-2 centered">
							<PageTitle
								title={D.correspondencesSearchTitle}
								col={12}
								offset={0}
								context="classifications"
							/>
							<SearchRmes
								items={correspondences}
								childPath="classifications/correspondence"
								context="classifications"
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

CorrespondencesHome.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		}).isRequired
	),
};

export default CorrespondencesHome;
