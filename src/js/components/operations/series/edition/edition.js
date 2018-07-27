import React, { Component } from 'react';
import PageSubtitle from 'js/components/shared/page-subtitle';
import PageTitle from 'js/components/shared/page-title';
import D from 'js/i18n';
import { goBack } from 'js/utils/redirection';
import NoteFlag from 'js/components/shared/note-flag';
import PropTypes from 'prop-types';
import EditorMarkdown from 'js/components/shared/editor-markdown';

const defaultSerie = {
	id: '',
	prefLabelLg1: '',
	prefLabelLg2: '',
	altLabel1: '',
	altLabel2: '',
	abstractLg1: '',
	abstractLg2: '',
	historyNoteLg1: '',
	historyNoteLg2: '',
};
class OperationsSerieEdition extends Component {
	constructor(props) {
		super(props);
		this.state = {
			serie: {
				...defaultSerie,
				...props.serie,
			},
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			serie: {
				...defaultSerie,
				...nextProps.serie,
			},
		});
	}
	onChange(e) {
		this.setState({
			serie: {
				...this.state.serie,
				[e.target.id]: e.target.value,
			},
		});
	}
	onSubmit() {
		this.props.saveSerie(this.state.serie);
		goBack(this.props, '/operations/series/' + this.state.serie.id)();
	}

	render() {
		const { langs: { lg1, lg2 }, frequencies, categories } = this.props;

		const { serie } = this.state;

		return (
			<div className="container editor-container">
				<PageTitle title={this.props.serie.prefLabelLg1} context="operations" />
				{serie.prefLabelLg2 && (
					<PageSubtitle subTitle={this.props.serie.prefLabelLg2} />
				)}
				<div className="row btn-line">
					<div className="col-md-2">
						<button
							className="btn btn-primary btn-lg col-md-12"
							onClick={goBack(this.props, '/operations/series')}
						>
							<span
								className="glyphicon glyphicon-floppy-remove"
								aria-hidden="true"
							/>{' '}
							{D.btnCancel}
						</button>
					</div>
					<div className="col-md-8 centered" />
					<div className="col-md-2 pull-right">
						<button
							className="btn btn-primary btn-lg col-md-12"
							onClick={this.onSubmit}
						>
							<span
								className="glyphicon glyphicon-floppy-disk"
								aria-hidden="true"
							/>{' '}
							{D.btnSave}
						</button>
					</div>
				</div>
				<form className="row">
					<div className="col-md-6">
						<div className="form-group">
							<label htmlFor="prefLabelLg1">
								<NoteFlag text={D.title} lang={lg1} />
							</label>
							<input
								type="text"
								className="form-control"
								id="prefLabelLg1"
								value={serie.prefLabelLg1}
								onChange={this.onChange}
								disabled
							/>
						</div>
						<div className="form-group">
							<label htmlFor="altLabelLg1">
								<NoteFlag text={D.altLabel} lang={lg1} />
							</label>
							<input
								type="text"
								className="form-control"
								id="altLabelLg1"
								value={serie.altLabelLg1}
								onChange={this.onChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="abstractLg1">
								<NoteFlag text={D.summary} lang={lg1} />
							</label>
							<EditorMarkdown
								text={serie.abstractLg1}
								handleChange={value =>
									this.onChange({ target: { value, id: 'abstractLg1' } })
								}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="historyNoteLg1">
								<NoteFlag text={D.history} lang={lg1} />
							</label>
							<EditorMarkdown
								text={serie.historyNoteLg1}
								handleChange={value =>
									this.onChange({ target: { value, id: 'historyNoteLg1' } })
								}
							/>
						</div>
					</div>
					<div className="col-md-6">
						<div className="form-group">
							<label htmlFor="prefLabelLg2">
								<NoteFlag text={D.title} lang={lg2} />
							</label>
							<input
								type="text"
								className="form-control"
								id="prefLabelLg2"
								value={serie.prefLabelLg2}
								onChange={this.onChange}
								disabled
							/>
						</div>
						<div className="form-group">
							<label htmlFor="altLabel2">
								<NoteFlag text={D.altLabel} lang={lg2} />
							</label>
							<input
								type="text"
								className="form-control"
								id="altLabelLg2"
								value={serie.altLabelLg2}
								onChange={this.onChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="abstractLg2">
								<NoteFlag text={D.summary} lang={lg2} />
							</label>
							<EditorMarkdown
								text={serie.abstractLg2}
								handleChange={value =>
									this.onChange({ target: { value, id: 'abstractLg2' } })
								}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="historyNoteLg2">
								<NoteFlag text={D.history} lang={lg2} />
							</label>
							<EditorMarkdown
								text={serie.historyNoteLg2}
								handleChange={value =>
									this.onChange({ target: { value, id: 'historyNoteLg2' } })
								}
							/>
						</div>
					</div>
					<div className="col-md-12">
						<div className="form-group">
							<label htmlFor="typeOperation">{D.operationType}</label>
							<select
								className="form-control"
								id="typeCode"
								value={serie.typeCode}
								onChange={this.onChange}
							>
								{categories.codes.map(category => (
									<option value={category.code}>{category.labelLg1}</option>
								))}
							</select>
						</div>
						<div className="form-group">
							<label htmlFor="accrualPeriodicity">
								{D.dataCollectFrequency}
							</label>
							{
								<select
									className="form-control"
									id="accrualPeriodicityCode"
									value={serie.accrualPeriodicityCode}
									onChange={this.onChange}
								>
									{frequencies.codes.map(category => (
										<option value={category.code}>{category.labelLg1}</option>
									))}
								</select>
							}
						</div>
						<div className="form-group">
							<label htmlFor="creator">{D.organisation}</label>
							<input
								type="text"
								className="form-control"
								id="creator"
								value={serie.creator}
								onChange={this.onChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="stakeHolder">{D.stakeholders}</label>
							<input
								value={serie.stakeHolder}
								className="form-control"
								id="stakeHolder"
								onChange={this.onChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="dataCollector">{D.dataCollector}</label>
							<input
								value={serie.dataCollector}
								className="form-control"
								id="dataCollector\"
								onChange={this.onChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="contributor">{D.contributorTitle}</label>
							<input
								value={serie.contributor}
								className="form-control"
								id="contributor"
								onChange={this.onChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="replaces">{D.replaces}</label>
							<textarea
								value={serie.replaces}
								className="form-control"
								id="replaces"
								rows="10"
								onChange={this.onChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="replacedBy">{D.replacedBy}</label>
							<textarea
								value={serie.replacedBy}
								className="form-control"
								id="replacedBy"
								rows="10"
								onChange={this.onChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="indicators">{D.indicators}</label>
							<textarea
								value={serie.indicators}
								className="form-control"
								id="indicators"
								rows="10"
								onChange={this.onChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="seeAlso">{D.seeAlso}</label>
							<textarea
								value={serie.seeAlso}
								className="form-control"
								id="seeAlso"
								rows="10"
								onChange={this.onChange}
							/>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

OperationsSerieEdition.propTypes = {
	serie: PropTypes.object.isRequired,
	langs: PropTypes.object.isRequired,
	saveSerie: PropTypes.func.isRequired,
	categories: PropTypes.object.isRequired,
	frequencies: PropTypes.object.isRequired,
};

export default OperationsSerieEdition;
