import React, { Component } from 'react';
import D, { D1, D2 } from 'js/i18n';
import PropTypes from 'prop-types';
import EditorMarkdown from 'js/applications/shared/editor-html/editor-markdown';
import { CL_FREQ } from 'js/actions/constants/codeList';
import InputRmes from 'js/applications/shared/input-rmes';
import Control from 'js/applications/operations/indicators/edition/control';
import SelectRmes from 'js/applications/shared/select-rmes';
import {
	toSelectModel,
	mergedItemsToSelectModels,
} from 'js/applications/operations/shared/utils/itemToSelectModel';
import { validate } from 'js/applications/operations/indicators/edition/validation';
import { Loading, goBackOrReplace } from '@inseefr/wilco';
import PageTitleBlock from 'js/applications/shared/page-title-block';

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
		stamps: PropTypes.arrayOf(PropTypes.string),
	};

	constructor(props) {
		super(props);
		this.state = this.setInitialState(props);

		this.onChanges = [
			'prefLabelLg1',
			'prefLabelLg2',
			'altLabelLg1',
			'altLabelLg2',
			'abstractLg1',
			'abstractLg2',
			'historyNoteLg1',
			'historyNoteLg2',
			'creator',
			'gestionnaire',
			'accrualPeriodicityCode',
		].reduce(
			(acc, selector) => ({
				...acc,
				[selector]: this.onChange(selector),
			}),
			{}
		);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.indicator.id !== this.props.indicator.id) {
			this.setState(this.setInitialState(nextProps));
		}
	}

	setInitialState = props => {
		return {
			serverSideError: '',
			indicator: {
				...defaultIndicator,
				...props.indicator,
			},
		};
	};

	onChange = selector => {
		return value => {
			this.setState({
				serverSideError: '',
				indicator: {
					...this.state.indicator,
					[selector]: value,
				},
			});
		};
	};

	onSubmit = () => {
		const isCreation = !this.state.indicator.id;

		this.props.saveIndicator(this.state.indicator, (err, id) => {
			if (!err) {
				goBackOrReplace(this.props, `/operations/indicator/${id}`, isCreation);
			} else {
				this.setState({
					serverSideError: err,
				});
			}
		});
	};

	render() {
		if (this.props.operationsAsyncTask) return <Loading textType="saving" />;

		const {
			frequencies,
			organisations,
			indicators,
			series,
			stamps,
		} = this.props;
		const isUpdate = !!this.state.indicator.id;
		const indicator = {
			...this.state.indicator,
			seeAlso: (this.state.indicator.seeAlso || []).map(link => link.id),
			contributor: (this.state.indicator.contributor || []).map(
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

		const stampsOptions = stamps.map(stamp => ({ value: stamp, label: stamp }));
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
		const errors = validate(this.state.indicator);
		const globalError = errors.errorMessage || this.state.serverSideError;

		return (
			<div className="container editor-container">
				{isUpdate && (
					<PageTitleBlock
						titleLg1={indicator.prefLabelLg1}
						titleLg2={indicator.prefLabelLg2}
						secondLang={true}
					/>
				)}
				<Control
					indicator={this.state.indicator}
					onSubmit={this.onSubmit}
					errorMessage={globalError}
				/>

				<form>
					<h4 className="centered">
						( <span className="boldRed">*</span> : {D.requiredFields})
					</h4>
					<div className="row">
						<InputRmes
							colMd={6}
							value={indicator.prefLabelLg1}
							label={D1.title}
							star
							handleChange={this.onChanges.prefLabelLg1}
							arias={{
								'aria-invalid': errors.fields.prefLabelLg1,
							}}
						/>
						<InputRmes
							colMd={6}
							value={indicator.prefLabelLg2}
							label={D2.title}
							star
							handleChange={this.onChanges.prefLabelLg2}
							arias={{
								'aria-invalid': errors.fields.prefLabelLg2,
							}}
						/>
					</div>
					<div className="row">
						<InputRmes
							colMd={6}
							value={indicator.altLabelLg1}
							label={D1.altLabel}
							handleChange={this.onChanges.altLabelLg1}
						/>
						<InputRmes
							colMd={6}
							value={indicator.altLabelLg2}
							label={D2.altLabel}
							handleChange={this.onChanges.altLabelLg2}
						/>
					</div>
					<div className="row">
						<div className="form-group col-md-6">
							<label htmlFor="abstractLg1">{D1.summary}</label>
							<EditorMarkdown
								text={indicator.abstractLg1}
								handleChange={this.onChanges.abstractLg1}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="abstractLg2">{D2.summary}</label>
							<EditorMarkdown
								text={indicator.abstractLg2}
								handleChange={this.onChanges.abstractLg2}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-6">
							<label htmlFor="historyNoteLg1">{D1.history}</label>
							<EditorMarkdown
								text={indicator.historyNoteLg1}
								handleChange={this.onChanges.historyNoteLg1}
							/>
						</div>
						<div className="form-group col-md-6">
							<label htmlFor="historyNoteLg2">{D2.history}</label>
							<EditorMarkdown
								text={indicator.historyNoteLg2}
								handleChange={this.onChanges.historyNoteLg2}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="accrualPeriodicity" className="full-label">
								{D1.indicatorDataCollectFrequency}
								<SelectRmes
									placeholder=""
									unclearable
									value={indicator.accrualPeriodicityCode}
									options={frequencies.codes.map(cat => {
										return { value: cat.code, label: cat.labelLg1 };
									})}
									onChange={this.onChange('accrualPeriodicityCode')}
								/>
							</label>
						</div>
					</div>

					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="creator" className="full-label">
								{D1.organisation}

								<SelectRmes
									unclearable
									value={indicator.creator}
									options={organisationsOptions}
									placeholder=""
									onChange={this.onChanges.creator}
								/>
							</label>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="contributor" className="full-label">
								{D1.operationsContributorTitle}
								<SelectRmes
									placeholder=""
									unclearable
									multi
									value={indicator.gestionnaire}
									options={stampsOptions}
									onChange={value =>
										this.onChange('gestionnaire')(value.map(v => v.value))
									}
								/>
							</label>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label className="full-label">
								{D1.stakeholders}
								<SelectRmes
									unclearable
									value={indicator.contributor}
									options={organisationsOptions}
									placeholder=""
									multi
									onChange={value =>
										this.onChange('contributor')(
											value.map(v => {
												return { id: v.value };
											})
										)
									}
								/>
							</label>
						</div>
					</div>

					<div className="row">
						<div className="form-group col-md-12">
							<label className="full-label">
								{D1.replaces}
								<SelectRmes
									unclearable
									value={indicator.replaces}
									options={indicatorsOptions}
									placeholder=""
									onChange={value =>
										this.onChange('replaces')(
											value.map(v => {
												return { id: v.value, type: v.type };
											})
										)
									}
									multi
								/>
							</label>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label className="full-label">
								{D1.replacedBy}
								<SelectRmes
									unclearable
									value={indicator.replacedBy}
									options={indicatorsOptions}
									placeholder=""
									onChange={value =>
										this.onChange('isReplacedBy')(
											value.map(v => {
												return { id: v.value, type: v.type };
											})
										)
									}
									multi
								/>
							</label>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label className="full-label">
								{D1.generatedBy}
								<SelectRmes
									unclearable
									value={indicator.wasGeneratedBy}
									options={seriesOptions}
									multi
									placeholder=""
									onChange={value =>
										this.onChange('wasGeneratedBy')(
											value.map(v => {
												return { id: v.value, type: v.type };
											})
										)
									}
								/>
							</label>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-12">
							<label htmlFor="seeAlso" className="full-label">
								{D1.seeAlso}
								<SelectRmes
									unclearable
									value={indicator.seeAlso}
									options={seriesAndIndicatorsOptions}
									placeholder=""
									onChange={value =>
										this.onChange('seeAlso')(
											value.map(v => {
												return { id: v.value, type: v.type };
											})
										)
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
