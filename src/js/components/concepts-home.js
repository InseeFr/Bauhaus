import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ConceptsListSearch from './concepts-list-search';
import MenuConcepts from './menu-concepts';
import { propTypes as overviewPropTypes } from 'js/utils/concepts/concept-overview';
import { dictionary } from 'js/utils/dictionary';
import 'css/app.css';

class ConceptsHome extends Component {
	constructor() {
		super();

		this.handleClick = e => {
			e.preventDefault();
			this.props.history.push('/create/concept');
		};
		this.handleClickExport = e => {
			e.preventDefault();
			this.props.history.push('/concepts/export');
		};
		this.handleClickValidate = e => {
			e.preventDefault();
			this.props.history.push('/concepts/validation');
		};
	}

	render() {
		const { concepts } = this.props;
		return (
			<div>
				<MenuConcepts />
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
									{dictionary.buttons.new.concept}
								</button>
							</div>
							<div className="row">
								<button
									className="btn btn-primary btn-lg col-md-offset-3 col-md-6"
									disabled
								>
									<span
										className="glyphicon glyphicon-import"
										aria-hidden="true"
									/>{' '}
									{dictionary.buttons.import}
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
								{dictionary.concepts.title}
							</h2>
							<ConceptsListSearch concepts={concepts} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

ConceptsHome.propTypes = {
	concepts: PropTypes.arrayOf(overviewPropTypes.isRequired),
};

//TODO use <Navigate /> so we don't need `withRouter`
export default withRouter(ConceptsHome);
