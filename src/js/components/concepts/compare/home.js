import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import PageTitle from 'js/components/shared/page-title';
import ConceptGeneral from '../visualization/general';
import ConceptCompareNotes from './notes';
import D from 'js/i18n';
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
		const { prefLabelLg1, prefLabelLg2 } = conceptGeneral;
		const { select1, select2 } = this.state;
		const conceptVersion = Number(conceptGeneral.conceptVersion);

		return (
			<div>
				<div className="container">
					<CheckSecondLang
						secondLang={secondLang}
						onChange={this.props.saveSecondLang}
					/>
					<PageTitle title={secondLang ? prefLabelLg2 : prefLabelLg1} />
					<div className="row btn-line">
						<div className="col-md-3">
							<button
								className="btn btn-primary btn-lg col-md-12"
								onClick={() => this.props.history.goBack()}
							>
								{D.btnReturnCurrent}
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
								{D.version} :{' '}
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
								{D.version} :{' '}
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
