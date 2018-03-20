import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';
import ConceptGeneral from './general';
import ConceptCompareNotes from './compare-notes';
import { dictionary } from 'js/utils/dictionary';
import {
	creatSelectList,
	creatSelectListSelectedLast,
} from 'js/utils/array-utils';

class ConceptCompare extends Component {
	constructor(props) {
		super(props);
		const version = Number(this.props.conceptGeneral.conceptVersion);
		this.state = { select1: version - 1, select2: version };

		this.changeSelect1 = e => {
			this.setState({
				select1: e.target.value,
			});
		};
		this.changeSelect2 = e => {
			this.setState({
				select2: e.target.value,
			});
		};
	}

	render() {
		const { conceptGeneral, conceptNotes, secondLang, langs } = this.props;
		const { select1, select2 } = this.state;
		const conceptVersion = Number(conceptGeneral.conceptVersion);

		return (
			<div>
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<label className="pull-right">
								<input
									type="checkbox"
									checked={secondLang}
									onChange={this.props.saveSecondLang}
								/>{' '}
								{dictionary.displayLg2}
							</label>
						</div>
					</div>
					<div className="row">
						<div className="col-md-10 centered col-md-offset-1">
							{!secondLang && (
								<h2 className="page-title">{conceptGeneral.prefLabelLg1}</h2>
							)}
							{secondLang && (
								<h2 className="page-title">
									<em>{conceptGeneral.prefLabelLg2} </em>
								</h2>
							)}
						</div>
					</div>
					<div className="row btn-line">
						<div className="col-md-3">
							<button
								className="btn btn-primary btn-lg col-md-12"
								onClick={() => this.props.history.goBack()}
							>
								{dictionary.buttons.returnCurrent}
							</button>
						</div>
					</div>
					<ConceptGeneral
						attr={conceptGeneral}
						secondLang={secondLang}
						langs={langs}
					/>
					<div className="row">
						<div className="col-md-6 centered">
							<h3>
								{' '}
								{dictionary.concept.version} :{' '}
								<select
									value={this.state.select1}
									onChange={e => this.changeSelect1(e)}
								>
									{creatSelectList(conceptVersion)}
								</select>
							</h3>
						</div>
						<div className="col-md-6 centered">
							<h3>
								{' '}
								{dictionary.concept.version} :{' '}
								<select
									value={this.state.select2}
									onChange={e => this.changeSelect2(e)}
								>
									{creatSelectListSelectedLast(conceptVersion)}
								</select>
							</h3>
						</div>
						<ConceptCompareNotes
							secondLang={secondLang}
							notesVersion1={conceptNotes[select1]}
							notesVersion2={conceptNotes[select2]}
							langs={langs}
						/>
					</div>
				</div>
			</div>
		);
	}
}

ConceptCompare.propTypes = {
	id: PropTypes.string.isRequired,
	conceptGeneral: generalPropTypes,
	// conceptNotes : {0:{definitionLg1:'XXX'}}
	conceptNotes: PropTypes.object.isRequired,
	secondLang: PropTypes.bool.isRequired,
	langs: PropTypes.object.isRequired,
};

export default withRouter(ConceptCompare);
