import { Component, Fragment, useContext, useEffect, useState } from 'react';
import { CheckSecondLang, Loading, Select } from '../../../../components';
import D from '../../../../deprecated-locales';
import SimsDocumentField from '../../../../modules-operations/msd/pages/sims-creation/sims-document-field';
import Field from '../../../../modules-operations/msd/pages/sims-creation/sims-field';
import { mdFromEditorState } from '../../../../utils/html-utils';
import { DUPLICATE } from '../../index';
import {
	getParentId,
	getParentIdName,
	hasLabelLg2,
	removeRubricsWhenDuplicate,
	shouldDisplayTitleForPrimaryItem,
} from '../../utils';

import {
	UNSAFE_NavigationContext as NavigationContext,
	useBlocker,
	useLocation,
} from 'react-router-dom';
import { ActionToolbar } from '../../../../components/action-toolbar';
import {
	CancelButton,
	SaveButton,
} from '../../../../components/buttons/buttons-with-icons';
import { OperationsApi } from '../../../../sdk/operations-api';
import { sortArrayByLabel } from '../../../../utils/array-utils';
import { flattenTree, rangeType } from '../../../utils/msd';
import { RubricEssentialMsg } from '../../rubric-essantial-msg';
import './sims-creation.scss';
import { useGoBack } from '../../../../utils/hooks/useGoBack';

const { RICH_TEXT } = rangeType;

const getDefaultSims = (mode, rubrics, metadataStructure) => {
	const flattenStructure = flattenTree(metadataStructure);

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

const convertRubric = (rubric) => {
	if (rubric.rangeType === 'RICH_TEXT') {
		return {
			...rubric,
			labelLg1: rubric.labelLg1
				? mdFromEditorState(rubric.labelLg1)
				: rubric.labelLg1,
			labelLg2: rubric.labelLg2
				? mdFromEditorState(rubric.labelLg2)
				: rubric.labelLg2,
		};
	}
	return rubric;
};
class SimsCreation2 {
	constructor() {
		this.unblock = this.props.navigator.block((tx) => {
			if (this.props.location?.pathname === tx.location?.pathname) {
				return true;
			}

			if (!this.state.changed || window.confirm(D.quitWithoutSaving)) {
				this.unblock();
				return true;
			}
			return false;
		});
	}
}

const SimsCreation = ({
	mode,
	idParent: idParentProp,
	sims: simsProp,
	defaultSimsRubrics,
	metadataStructure,
	parentType,
	onSubmit,
	codesLists = {},
	organisations = [],
	parentWithSims,
}) => {
	useBlocker(({ currentLocation, nextLocation }) => {
		if (currentLocation?.pathname === nextLocation?.pathname) {
			return true;
		}

		if (!changed || window.confirm(D.quitWithoutSaving)) {
			return true;
		}
		return false;
	});

	const goBack = useGoBack();
	const [changed, setChanged] = useState(false);
	const [saving, setSaving] = useState(false);
	const [loading, setLoading] = useState(false);
	const secondLang = true;
	const [idParent, setIdParent] = useState(
		mode !== DUPLICATE ? idParentProp || getParentId(simsProp) : ''
	);
	const [sims, setSims] = useState(
		getDefaultSims(
			mode,
			simsProp.rubrics || defaultSimsRubrics,
			metadataStructure
		)
	);

	const handleChange = (e) => {
		setChanged(true);
		setSims((sims) => ({ ...sims, [e.id]: { ...sims[e.id], ...e.override } }));
	};

	const updateIdParent = (value) => {
		setIdParent(value);
	};

	const handleSubmit = (e) => {
		//TODO this.unblock;

		e.preventDefault();
		e.stopPropagation();
		setSaving(true);

		const idParent = idParent || idParentProp;

		const rubrics = Object.values(sims).map(convertRubric);

		const sims = {
			id: mode !== DUPLICATE ? simsProp.id : '',
			labelLg1: mode !== DUPLICATE ? simsProp.labelLg1 : '',
			labelLg2: mode !== DUPLICATE ? simsProp.labelLg2 : '',
			[getParentIdName(parentType)]: idParent,
			created: mode !== DUPLICATE ? simsProp.created : '',
			rubrics,
		};
		onSubmit(sims, (id) => {
			setSaving(false);
			goBack(`/operations/sims/${id}`);
		});
	};

	const goBackUrl = sims.id
		? `/operations/sims/${sims.id}`
		: `/operations/${parentType}/${idParent}`;

	const organisationsOptions = sortArrayByLabel(
		organisations.map((c) => ({
			label: c.label,
			value: c.id,
		}))
	);

	const organisationsOptionsLg2 = sortArrayByLabel(
		organisations.map((c) => ({
			label: c.labelLg2,
			value: c.id,
		}))
	);

	const operationsOptions = (simsProp.parentsWithoutSims || []).map((op) => ({
		label: op.labelLg1,
		value: op.id,
	}));

	const operationsWithSimsOptions = (parentWithSims || [])
		.map((op) => ({
			label: op.labelLg1,
			value: op.idSims,
		}))
		.sort((o1, o2) =>
			o1.label.toLowerCase().localeCompare(o2.label.toLowerCase())
		);

	function MSDInformations(msd, handleChange, firstLevel = false) {
		return (
			<Fragment key={msd.idMas}>
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
								alone={!hasLabelLg2(msd) || !secondLang}
								organisationsOptions={organisationsOptions}
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
								alone={false}
								organisationsOptions={organisationsOptionsLg2}
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
								/>
							</div>
							{secondLang && (
								<div className="col-md-6">
									<SimsDocumentField
										msd={msd}
										currentSection={sims[msd.idMas]}
										handleChange={handleChange}
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
			</Fragment>
		);
	}

	const onSiblingSimsChange = () => {
		return (value) => {
			setLoading(true);
			const id = value;
			OperationsApi.getSims(id).then((result) => {
				setLoading(false);
				setSims(
					getDefaultSims(
						DUPLICATE,
						result.rubrics.reduce((acc, rubric) => {
							return {
								...acc,
								[rubric.idAttribute]: rubric,
							};
						}, {}),
						metadataStructure
					)
				);
			});
		};
	};
	if (loading) return <Loading textType="loading" />;
	if (saving) return <Loading textType="saving" />;

	return (
		<>
			<ActionToolbar>
				<CancelButton action={goBackUrl} />
				<SaveButton action={handleSubmit} col={3} />
			</ActionToolbar>

			<RubricEssentialMsg secondLang={secondLang} />

			{Object.values(metadataStructure).map((msd, index) => {
				return (
					<div key={msd.idMas} className="bauhaus-sims-creation">
						{index === 0 && (
							<>
								<CheckSecondLang />
								{mode === DUPLICATE && (
									<Select
										placeholder={D.operationsTitle}
										value={operationsOptions.find(
											({ value }) => value === idParent
										)}
										options={operationsOptions}
										onChange={updateIdParent}
									/>
								)}

								{mode !== DUPLICATE && (
									<Select
										className="bauhaus-sims-duplicate"
										placeholder={D.createFromAnExistingReport}
										value={operationsWithSimsOptions.find(
											({ value }) => value === idParent
										)}
										options={operationsWithSimsOptions}
										onChange={onSiblingSimsChange()}
										disabled={changed}
										autofocus
									/>
								)}
							</>
						)}
						{MSDInformations(msd, handleChange, true)}
					</div>
				);
			})}
		</>
	);
};

const withParentWithSims = (Component) => {
	return (props) => {
		const [parentWithSims, setParentWithSims] = useState([]);
		const parentType = props.parentType;
		const seriesId = props.parent?.series?.id;
		const familyId = props.parent?.family?.id;
		useEffect(() => {
			if (parentType === 'operation' && seriesId) {
				OperationsApi.getOperationsWithReport(seriesId).then((result) => {
					setParentWithSims(result);
				});
			} else if (parentType === 'series' && familyId) {
				OperationsApi.getSeriesWithReport(familyId).then((result) => {
					setParentWithSims(result);
				});
			} else if (parentType === 'indicator') {
				OperationsApi.getIndicatorsListWithSims().then((result) => {
					setParentWithSims(result);
				});
			}
		}, [seriesId, parentType, familyId]);
		return <Component {...props} parentWithSims={parentWithSims} />;
	};
};

const AdvancedSimsCreation = withParentWithSims(SimsCreation);
export default AdvancedSimsCreation;
