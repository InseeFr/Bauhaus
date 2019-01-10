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
import SelectRmes from 'js/components/shared/select-rmes';
import {
	toSelectModel,
	mergedItemsToSelectModels,
} from 'js/components/operations/shared/utils/itemToSelectModel';

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
	static propTypes = {
		indicator: PropTypes.object.isRequired,
		langs: PropTypes.object.isRequired,
		saveIndicator: PropTypes.func.isRequired,
		frequencies: PropTypes.object.isRequired,
	};

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
		const {
			langs: { lg1, lg2 },
			frequencies,
			organisations,
			indicators,
			series,
		} = this.props;
		const isUpdate = !!this.state.indicator.id;
		const indicator = {
			...this.state.indicator,
			seeAlso: (this.state.indicator.seeAlso || []).map(link => link.id),
			stakeHolder: (this.state.indicator.stakeHolder || []).map(
				link => link.id
			),
			wasGeneratedBy: (this.state.indicator.wasGeneratedBy || []).map(
				link => link.id
			),
			replaces: (this.state.indicator.replaces || []).map(link => link.id),
			replacedBy: (this.state.indicator.isReplacedBy || []).map(
				link => link.id
			),
		};

		const organisationsOptions = toSelectModel(organisations);
		const seriesOptions = toSelectModel(series, 'series');
		const indicatorsOptions = toSelectModel(
			indicators.filter(s => s.id !== indicator.id),
			'indicator'
		);
		const seriesAndIndicatorsOptions = mergedItemsToSelectModels(
			indicatorsOptions,
			seriesOptions
		);

		return (
			<div className="container editor-container">
				{isUpdate && (
					<React.Fragment>
						<PageTitle
							title={this.props.indicator.prefLabelLg1}
							context="operations"
						/>
						{indicator.prefLabelLg2 && (
							<PageSubtitle
								subTitle={this.props.indicator.prefLabelLg2}
								context="operations"
							/>
						)}
					</React.Fragment>
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
						<div className="form-group col-md-12">
							<label htmlFor="accrualPeriodicity" className="full-label">
								{D.indicatorDataCollectFrequency}
								<SelectRmes
									placeholder=""
									unclearable
									value={indicator.accrualPeriodicityCode}
									options={frequencies.codes.map(cat => {
										return { value: cat.code, label: cat.labelLg1 };
									})}
									onChange={value =>
										this.onChange({
											target: { value, id: 'accrualPeriodicityCode' },
										})
									}
								/>
							</label>
						</div>
					</div>

					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="creator" className="full-label">
								{D.organisation}

								<SelectRmes
									unclearable
									value={indicator.creator}
									options={organisationsOptions}
									placeholder=""
									onChange={value => {
										this.onChange({
											target: {
												value,
												id: 'creator',
											},
										});
									}}
								/>
							</label>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label className="full-label">
								{D.stakeholders}
								<SelectRmes
									unclearable
									value={indicator.stakeHolder}
									options={organisationsOptions}
									placeholder=""
									multi
									onChange={value => {
										this.onChange({
											target: {
												value: value.map(v => {
													return { id: v.value };
												}),
												id: 'stakeHolder',
											},
										});
									}}
								/>
							</label>
						</div>
					</div>

					<div className="row">
						<div className="form-group col-md-12">
							<label className="full-label">
								{D.replaces}
								<SelectRmes
									unclearable
									value={indicator.replaces}
									options={indicatorsOptions}
									placeholder=""
									onChange={value =>
										this.onChange({
											target: {
												value: value.map(v => {
													return { id: v.value, type: v.type };
												}),
												id: 'replaces',
											},
										})
									}
									multi
								/>
							</label>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label className="full-label">
								{D.replacedBy}
								<SelectRmes
									unclearable
									value={indicator.replacedBy}
									options={indicatorsOptions}
									placeholder=""
									onChange={value =>
										this.onChange({
											target: {
												value: value.map(v => {
													return { id: v.value, type: v.type };
												}),
												id: 'isReplacedBy',
											},
										})
									}
									multi
								/>
							</label>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label className="full-label">
								{D.generatedBy}
								<SelectRmes
									unclearable
									value={indicator.wasGeneratedBy}
									options={seriesOptions}
									multi
									placeholder=""
									onChange={value =>
										this.onChange({
											target: {
												value: value.map(v => {
													return { id: v.value, type: v.type };
												}),
												id: 'wasGeneratedBy',
											},
										})
									}
								/>
							</label>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="seeAlso" className="full-label">
								{D.seeAlso}
								<SelectRmes
									unclearable
									value={indicator.seeAlso}
									options={seriesAndIndicatorsOptions}
									placeholder=""
									onChange={value =>
										this.onChange({
											target: {
												value: value.map(v => {
													return { id: v.value, type: v.type };
												}),

												id: 'seeAlso',
											},
										})
									}
									multi
								/>
							</label>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default OperationsIndicatorEdition;
