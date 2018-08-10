import React, { Component } from 'react';
import PageSubtitle from 'js/components/shared/page-subtitle';
import PageTitle from 'js/components/shared/page-title';
import D from 'js/i18n';
import NoteFlag from 'js/components/shared/note-flag';
import PropTypes from 'prop-types';
import EditorMarkdown from 'js/components/shared/editor-markdown';
import { CL_FREQ } from 'js/actions/constants/codeList';
import InputRmes from 'js/components/shared/input-rmes';
import Control from 'js/components/operations/indicators/edition/control';
const defaultIndicator = {
	prefLabelLg1: '',
	prefLabelLg2: '',
	altLabelLg1: '',
	altLabelLg2: '',
	abstractLg1: '',
	abstractLg2: '',
	historyNoteLg1: '',
	historyNoteLg2: '',
	accrualPeriodicityList: CL_FREQ,
};
class OperationsIndicatorEdition extends Component {
	constructor(props) {
		super(props);
		this.state = {
			indicator: {
				...defaultIndicator,
				...props.indicator,
			},
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			indicator: {
				...defaultIndicator,
				...nextProps.indicator,
			},
		});
	}
	onChange(e) {
		this.setState({
			indicator: {
				...this.state.indicator,
				[e.target.id]: e.target.value,
			},
		});
	}

	onSubmit() {
		this.props.saveIndicator(
			this.state.indicator,
			(id = this.state.indicator.id) => {
				this.props.history.push(`/operations/indicator/${id}`);
			}
		);
	}

	render() {
		const { langs: { lg1, lg2 }, frequencies } = this.props;
		const isUpdate = !!this.state.indicator.id;
		console.log(this.state.indicator);
		//TODO To be changed when the edition of links will be enabled
		const indicator = {
			...this.state.indicator,
			seeAlso: (this.state.indicator.seeAlso || [])
				.map(link => link.id)
				.join(','),
			stakeHolder: (this.state.indicator.stakeHolder || []).map(
				link => link.id
			),
			wasGeneratedBy: (this.state.indicator.wasGeneratedBy || [])
				.map(link => link.id)
				.join(','),
			replaces: (this.state.indicator.replaces || [])
				.map(link => link.id)
				.join(','),
			replacedBy: (this.state.indicator.isReplacedBy || [])
				.map(link => link.id)
				.join(','),
			generate: (this.state.indicator.generate || [])
				.map(link => link.id)
				.join(','),
		};
		return (
			<div className="container editor-container">
				{isUpdate && (
					<div>
						<PageTitle
							title={this.props.indicator.prefLabelLg1}
							context="operations"
						/>
						{indicator.prefLabelLg2 && (
							<PageSubtitle subTitle={this.props.indicator.prefLabelLg2} />
						)}
					</div>
				)}
				<Control indicator={this.state.indicator} onSubmit={this.onSubmit} />

				<form>
					<h4 className="centered">
						( <span className="boldRed">*</span> : {D.requiredFields})
					</h4>
					<div className="row">
						<InputRmes
							colMd={6}
							value={indicator.prefLabelLg1}
							label={D.title}
							lang={lg1}
							star
							handleChange={value =>
								this.onChange({ target: { value, id: 'prefLabelLg1' } })
							}
						/>
						<InputRmes
							colMd={6}
							value={indicator.prefLabelLg2}
							label={D.title}
							lang={lg2}
							star
							handleChange={value =>
								this.onChange({ target: { value, id: 'prefLabelLg2' } })
							}
						/>
					</div>
					<div className="row">
						<InputRmes
							colMd={6}
							value={indicator.altLabelLg1}
							label={D.altLabel}
							lang={lg1}
							handleChange={value =>
								this.onChange({ target: { value, id: 'altLabelLg1' } })
							}
						/>
						<InputRmes
							colMd={6}
							value={indicator.altLabelLg2}
							label={D.altLabel}
							lang={lg2}
							handleChange={value =>
								this.onChange({ target: { value, id: 'altLabelLg2' } })
							}
						/>
					</div>
					<div className="row">
						<div className="form-group col-md-6">
							<label htmlFor="abstractLg1">
								<NoteFlag text={D.summary} lang={lg1} />
							</label>
							<EditorMarkdown
								text={indicator.abstractLg1}
								handleChange={value =>
									this.onChange({ target: { value, id: 'abstractLg1' } })
								}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="abstractLg2">
								<NoteFlag text={D.summary} lang={lg2} />
							</label>
							<EditorMarkdown
								text={indicator.abstractLg2}
								handleChange={value =>
									this.onChange({ target: { value, id: 'abstractLg2' } })
								}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-6">
							<label htmlFor="historyNoteLg1">
								<NoteFlag text={D.history} lang={lg1} />
							</label>
							<EditorMarkdown
								text={indicator.historyNoteLg1}
								handleChange={value =>
									this.onChange({ target: { value, id: 'historyNoteLg1' } })
								}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="historyNoteLg2">
								<NoteFlag text={D.history} lang={lg2} />
							</label>
							<EditorMarkdown
								text={indicator.historyNoteLg2}
								handleChange={value =>
									this.onChange({ target: { value, id: 'historyNoteLg2' } })
								}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12 form-group">
							<label htmlFor="accrualPeriodicity">
								{D.dataCollectFrequency}
							</label>
							{
								<select
									className="form-control"
									id="accrualPeriodicityCode"
									value={indicator.accrualPeriodicityCode}
									onChange={this.onChange}
								>
									{frequencies.codes.map(category => (
										<option key={category.code} value={category.code}>
											{category.labelLg1}
										</option>
									))}
								</select>
							}
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="creator">{D.organisation}</label>
							<input
								type="text"
								className="form-control"
								id="creator"
								value={indicator.creator}
								onChange={this.onChange}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="stakeHolder">{D.stakeholders}</label>
							<input
								disabled
								value={indicator.stakeHolder}
								className="form-control"
								id="stakeHolder"
								onChange={this.onChange}
							/>
						</div>
					</div>

					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="replaces">{D.replaces}</label>
							<input
								disabled
								value={indicator.replaces}
								className="form-control"
								id="replaces"
								onChange={this.onChange}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="replacedBy">{D.replacedBy}</label>
							<input
								disabled
								value={indicator.replacedBy}
								className="form-control"
								id="replacedBy"
								onChange={this.onChange}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="wasGeneratedBy">{D.generatedBy}</label>
							<input
								disabled
								value={indicator.wasGeneratedBy}
								className="form-control"
								id="wasGeneratedBy"
								onChange={this.onChange}
							/>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

OperationsIndicatorEdition.propTypes = {
	indicator: PropTypes.object.isRequired,
	langs: PropTypes.object.isRequired,
	saveIndicator: PropTypes.func.isRequired,
	frequencies: PropTypes.object.isRequired,
};

export default OperationsIndicatorEdition;
