import React, { useEffect, useState } from 'react';
import D from 'js/i18n';
import Field from 'js/applications/operations/msd/pages/sims-creation/sims-field';
import { flattenTree } from 'js/utils/msd';
import SimsDocumentField from 'js/applications/operations/msd/pages/sims-creation/sims-document-field';
import { withRouter } from 'react-router-dom';
import {
	Loading,
	CancelButton,
	ActionToolbar,
	SaveButton,
	Select,
	CheckSecondLang,
} from '@inseefr/wilco';
import { default as ReactSelect } from 'react-select';

import { DUPLICATE } from 'js/applications/operations/msd';
import {
	hasLabelLg2,
	getParentId,
	getParentIdName,
	removeRubricsWhenDuplicate,
	shouldDisplayTitleForPrimaryItem,
} from 'js/applications/operations/msd/utils';
import { HTMLUtils, ArrayUtils } from 'bauhaus-utilities';
import './sims-creation.scss';
import { rangeType } from 'js/utils/msd/';
import api from '../../../../../remote-api/operations-api';
import { RubricEssentialMsg } from '../../rubric-essantial-msg';

const { RICH_TEXT } = rangeType;

class SimsCreation extends React.Component {
	constructor(props) {
		super(props);

		this.unblock = this.props.history.block((location) => {
			// withRouter utile
			if (this.props.history.location?.pathname === location?.pathname) {
				// withRouter utile
				return true;
			}

			if (!this.state.changed || window.confirm(D.quitWithoutSaving)) {
				this.unblock();
				return true;
			}
			return false;
		});

		this.state = {
			changed: false,
			saving: false,
			loading: false,
			idParent:
				this.props.mode !== DUPLICATE
					? this.props.idParent || getParentId(this.props.sims)
					: '',

			sims: this.getDefaultSims(
				this.props.mode,
				this.props.sims.rubrics || this.props.defaultSimsRubrics
			),
			secondLang: true,
		};
	}

	getDefaultSims = (mode, rubrics) => {
		const flattenStructure = flattenTree(this.props.metadataStructure);

		return {
			...Object.keys(flattenStructure).reduce((acc, key) => {
				return {
					...acc,
					[key]: {
						rangeType: flattenStructure[key].rangeType,
						idAttribute: key,
						value: '',
						labelLg1: '',
						labelLg2: '',
					},
				};
			}, {}),
			...removeRubricsWhenDuplicate(mode, rubrics),
		};
	};
	handleChange = (e) => {
		this.setState((state) => ({
			...state,
			changed: true,
			sims: {
				...state.sims,
				[e.id]: {
					...state.sims[e.id],
					...e.override,
				},
			},
		}));
	};

	updateIdParent = (value) => {
		this.setState({
			idParent: value,
		});
	};

	handleSubmit = (e) => {
		this.unblock();
		e.preventDefault();
		e.stopPropagation();

		this.setState({ saving: true });

		/**
		 * we get the id of the parent object.
		 * the id coming from the state is used for duplicate
		 * the id coming from the props is during creation / update
		 */
		const idParent = this.state.idParent || this.props.idParent;

		const rubrics = Object.values(this.state.sims).map(this.convertRubric);

		const sims = {
			id: this.props.mode !== DUPLICATE ? this.props.sims.id : '',
			labelLg1: this.props.mode !== DUPLICATE ? this.props.sims.labelLg1 : '',
			labelLg2: this.props.mode !== DUPLICATE ? this.props.sims.labelLg2 : '',
			[getParentIdName(this.props.parentType)]: idParent,
			created: this.props.mode !== DUPLICATE ? this.props.sims.created : '',
			rubrics,
		};
		this.props.onSubmit(sims, (id) => {
			this.setState({ saving: false });
			this.props.goBack(`/operations/sims/${id}`);
		});
	};

	goBack = () => {
		const { goBack, sims, parentType } = this.props;
		const { idParent } = this.state;
		goBack(
			sims.id
				? `/operations/sims/${sims.id}`
				: `/operations/${parentType}/${idParent}`
		);
	};

	convertRubric = (rubric) => {
		if (rubric.rangeType === 'RICH_TEXT') {
			return {
				...rubric,
				labelLg1: rubric.labelLg1
					? HTMLUtils.mdFromEditorState(rubric.labelLg1)
					: rubric.labelLg1,
				labelLg2: rubric.labelLg2
					? HTMLUtils.mdFromEditorState(rubric.labelLg2)
					: rubric.labelLg2,
			};
		}
		return rubric;
	};
	render() {
		const {
			metadataStructure,
			codesLists = {},
			mode,
			langs: { lg1, lg2 },
			organisations = [],
			geographiesOptions = [],
			documentStores,
		} = this.props;
		const { secondLang, sims, idParent } = this.state;

		const organisationsOptions = ArrayUtils.sortArrayByLabel(
			organisations.map((c) => ({
				label: c.label, // no labelLg2 in organisations ?
				value: c.id,
			}))
		);

		const operationsOptions = (this.props.sims.parentsWithoutSims || []).map(
			(op) => ({
				label: op.labelLg1,
				value: op.id,
			})
		);

		const operationsWithSimsOptions = (this.props.parentWithSims || [])
			.map((op) => ({
				label: op.labelLg1,
				value: op.idSims,
			}))
			.sort((o1, o2) =>
				o1.label.toLowerCase().localeCompare(o2.label.toLowerCase())
			);

		function MSDInformations(msd, handleChange, firstLevel = false) {
			return (
				<React.Fragment key={msd.idMas}>
					{firstLevel && shouldDisplayTitleForPrimaryItem(msd) && (
						<h3 className="col-md-12 sims-title">
							{msd.idMas} - {msd.masLabelBasedOnCurrentLang}
						</h3>
					)}
					<div
						className={`bauhaus-sims-field row ${
							!secondLang
								? 'bauhaus-sims-field__' + msd.rangeType
								: 'bauhaus-sims-field__' + msd.rangeType + '_2col'
						}`}
						id={msd.idMas}
					>
						<div className="bauhaus-sims-field-form">
							{!msd.isPresentational && (
								<Field
									msd={msd}
									currentSection={sims[msd.idMas]}
									handleChange={handleChange}
									codesLists={codesLists}
									secondLang={false}
									lang={lg1}
									alone={!hasLabelLg2(msd) || !secondLang}
									organisationsOptions={organisationsOptions}
									geographiesOptions={geographiesOptions}
									unbounded={msd.maxOccurs === 'unbounded'}
								/>
							)}
							{!msd.isPresentational && hasLabelLg2(msd) && secondLang && (
								<Field
									msd={msd}
									currentSection={sims[msd.idMas]}
									handleChange={handleChange}
									codesLists={codesLists}
									secondLang={true}
									lang={lg2}
									alone={false}
									organisationsOptions={organisationsOptions}
									geographiesOptions={geographiesOptions}
									unbounded={msd.maxOccurs === 'unbounded'}
								/>
							)}
						</div>
						{msd.rangeType === RICH_TEXT && (
							<div className="row bauhaus-documents-bloc">
								<div className={`col-md-${secondLang ? 6 : 12}`}>
									<SimsDocumentField
										msd={msd}
										currentSection={sims[msd.idMas]}
										handleChange={handleChange}
										documentStores={documentStores}
									/>
								</div>
								{secondLang && (
									<div className="col-md-6">
										<SimsDocumentField
											msd={msd}
											currentSection={sims[msd.idMas]}
											handleChange={handleChange}
											documentStores={documentStores}
											lang="Lg2"
										/>
									</div>
								)}
							</div>
						)}
					</div>
					{Object.values(msd.children).map((child) =>
						MSDInformations(child, handleChange)
					)}
				</React.Fragment>
			);
		}

		if (this.state.loading) return <Loading textType="loading" />;
		if (this.state.saving) return <Loading textType="saving" />;

		return (
			<>
				<ActionToolbar>
					<CancelButton action={this.goBack} />
					<SaveButton action={this.handleSubmit} col={3} />
				</ActionToolbar>

				<RubricEssentialMsg secondLang={secondLang} />

				{Object.values(metadataStructure).map((msd, index) => {
					return (
						<div key={msd.idMas} className="bauhaus-sims-creation">
							{index === 0 && (
								<React.Fragment>
									<CheckSecondLang
										secondLang={secondLang}
										onChange={() => {
											this.setState({
												secondLang: !this.state.secondLang,
											});
										}}
									/>
									{mode === DUPLICATE && (
										<Select
											value={operationsOptions.find(
												({ value }) => value === idParent
											)}
											placeholder={D.operationsTitle}
											options={operationsOptions}
											onChange={this.updateIdParent}
											searchable
										/>
									)}

									{mode !== DUPLICATE && (
										<ReactSelect
											placeholder={D.createFromAnExistingReport}
											value={operationsWithSimsOptions.find(
												({ value }) => value === idParent
											)}
											options={operationsWithSimsOptions}
											onChange={this.onSiblingSimsChange()}
											disabled={this.state.changed}
											searchable
										/>
									)}
								</React.Fragment>
							)}
							{MSDInformations(msd, this.handleChange, true)}
						</div>
					);
				})}
			</>
		);
	}

	onSiblingSimsChange() {
		return (sims) => {
			this.setState({ loading: true }, () => {
				const id = sims.value;
				api.getSims(id).then((result) => {
					this.setState({
						loading: false,
						sims: this.getDefaultSims(
							DUPLICATE,
							result.rubrics.reduce((acc, rubric) => {
								return {
									...acc,
									[rubric.idAttribute]: rubric,
								};
							}, {})
						),
					});
				});
			});
		};
	}
}

const withParentWithSims = (Component) => {
	return (props) => {
		const [parentWithSims, setParentWithSims] = useState([]);
		const parentType = props.parentType;
		const seriesId = props.parent?.series?.id;
		const familyId = props.parent?.family?.id;
		useEffect(() => {
			if (parentType === 'operation' && seriesId) {
				api.getOperationsWithReport(seriesId).then((result) => {
					setParentWithSims(result);
				});
			} else if (parentType === 'series' && familyId) {
				api.getSeriesWithReport(familyId).then((result) => {
					setParentWithSims(result);
				});
			} else if (parentType === 'indicator') {
				api.getIndicatorsListWithSims().then((result) => {
					setParentWithSims(result);
				});
			}
		}, [seriesId, parentType, familyId]);
		return <Component {...props} parentWithSims={parentWithSims} />;
	};
};

const AdvancedSimsCreation = withParentWithSims(SimsCreation);
export default withRouter(AdvancedSimsCreation);
