import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import CollectionListSearch from './search';

import { propTypes as overviewPropTypes } from 'js/utils/collections/collection-overview';
import { dictionary } from 'js/utils/dictionary';
import 'css/app.css';

class CollectionsHome extends Component {
	constructor() {
		super();

		this.handleClick = e => {
			e.preventDefault();
			this.props.history.push('/create/collection');
		};
		this.handleClickExport = e => {
			e.preventDefault();
			this.props.history.push('/collections/export');
		};
		this.handleClickValidate = e => {
			e.preventDefault();
			this.props.history.push('/collections/validation');
		};
	}

	render() {
		const { collections } = this.props;
		return (
			<div>
				<div className="container">
					<div className="row">
						<div className="col-md-3 btn-group-vertical">
							<div className="row">
								<button
									className="btn btn-primary btn-lg col-md-offset-3 col-md-6"
									onClick={this.handleClick}
								>
									<span
										className="glyphicon glyphicon-plus"
										aria-hidden="true"
									/>{' '}
									{dictionary.buttons.new.collection}
								</button>
							</div>
							<div className="row">
								<button
									className="btn btn-primary btn-lg col-md-offset-3 col-md-6"
									onClick={this.handleClickExport}
								>
									<span
										className="glyphicon glyphicon-export"
										aria-hidden="true"
									/>{' '}
									{dictionary.buttons.export}
								</button>
							</div>
							<div className="row">
								<button
									className="btn btn-primary btn-lg col-md-offset-3 col-md-6"
									onClick={this.handleClickValidate}
								>
									<span
										className="glyphicon glyphicon-ok"
										aria-hidden="true"
									/>{' '}
									{dictionary.buttons.validate}
								</button>
							</div>
						</div>
						<div className="col-md-8 centered pull-right">
							<h2 className="page-title">
								{dictionary.collections.title}
							</h2>
							<CollectionListSearch collections={collections} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

CollectionsHome.propTypes = {
	collections: PropTypes.arrayOf(overviewPropTypes.isRequired),
};

//TODO use <Navigate /> so we don't need `withRouter`
export default withRouter(CollectionsHome);
