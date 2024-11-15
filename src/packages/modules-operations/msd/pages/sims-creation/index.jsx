import { Fragment, useEffect, useState } from 'react';
import { CheckSecondLang, Loading } from '../../../../components';
import { Select } from '../../../../components/select-rmes';

import D from '../../../../deprecated-locales';
import SimsDocumentField from '../../../../modules-operations/msd/pages/sims-creation/sims-document-field';
import Field from '../../../../modules-operations/msd/pages/sims-creation/sims-field';
import { mdFromEditorState } from '../../../../utils/html-utils';
import { DUPLICATE } from '../../constant';
import {
	getParentId,
	getParentIdName,
	hasLabelLg2,
	shouldDisplayTitleForPrimaryItem,
} from '../../utils';

import { useBlocker } from 'react-router-dom';
import { ActionToolbar } from '../../../../components/action-toolbar';
import {
	CancelButton,
	CloseIconButton,
	SaveButton,
} from '../../../../components/buttons/buttons-with-icons';
import { OperationsApi } from '../../../../sdk/operations-api';
import { sortArrayByLabel } from '../../../../utils/array-utils';
import { useGoBack } from '../../../../utils/hooks/useGoBack';
import { rangeType } from '../../../utils/msd';
import { RubricEssentialMsg } from '../../rubric-essantial-msg';
import { DocumentFormPanel } from './document-form-panel';
import { useDocumentsStoreContext } from './documents-store-context';
import './sims-creation.scss';
import { getDefaultSims, getSiblingSims } from './utils/getSims';
import Modal from 'react-modal';
import { Button } from '../../../../components/buttons/button';

const { RICH_TEXT } = rangeType;

export const generateSimsBeforeSubmit = (
	mode,
	simsProp,
	parentType,
	idParent,
	rubrics,
) => {
	return {
		id: mode !== DUPLICATE ? simsProp.id : '',
		labelLg1: mode !== DUPLICATE ? simsProp.labelLg1 : '',
		labelLg2: mode !== DUPLICATE ? simsProp.labelLg2 : '',
		[getParentIdName(parentType)]: idParent,
		created: mode !== DUPLICATE ? simsProp.created : '',
		rubrics,
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
	const goBack = useGoBack();
	const [changed, setChanged] = useState(false);
	const [saving, setSaving] = useState(false);
	const [loading, setLoading] = useState(false);
	const secondLang = true;
	const [idParent, setIdParent] = useState(
		mode !== DUPLICATE ? idParentProp || getParentId(simsProp) : '',
	);

	const blocker = useBlocker(({ currentLocation, nextLocation }) => {
		return changed && currentLocation.pathname !== nextLocation.pathname;
	});

	const [sims, setSims] = useState(
		getDefaultSims(
			mode,
			simsProp.rubrics || defaultSimsRubrics,
			metadataStructure,
		),
	);

	const handleChange = (e) => {
		setChanged(true);
		setSims((sims) => ({ ...sims, [e.id]: { ...sims[e.id], ...e.override } }));
	};

	const updateIdParent = (value) => {
		setIdParent(value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setSaving(true);

		const idParentToSave = idParent || idParentProp;
		const rubrics = Object.values(sims).map(convertRubric);

		setChanged(false);

		onSubmit(
			generateSimsBeforeSubmit(
				mode,
				simsProp,
				parentType,
				idParentToSave,
				rubrics,
			),
			(id) => {
				setSaving(false);
				goBack(`/operations/sims/${id}`, true);
			},
		);
	};

	const goBackUrl = sims.id
		? `/operations/sims/${sims.id}`
		: `/operations/${parentType}/${idParent}`;

	const organisationsOptions = sortArrayByLabel(
		organisations.map((c) => ({
			label: c.label,
			value: c.id,
		})),
	);

	const organisationsOptionsLg2 = sortArrayByLabel(
		organisations.map((c) => ({
			label: c.labelLg2,
			value: c.id,
		})),
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
			o1.label.toLowerCase().localeCompare(o2.label.toLowerCase()),
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
					MSDInformations(child, handleChange),
				)}
			</Fragment>
		);
	}

	const onSiblingSimsChange = () => {
		return (value) => {
			setLoading(true);
			getSiblingSims(value, metadataStructure).then((sims) => {
				setLoading(false);
				setSims(sims);
			});
		};
	};

	const { lateralPanelOpened, onLateralPanelHide } = useDocumentsStoreContext();

	if (loading) return <Loading />;
	if (saving) return <Loading textType="saving" />;

	return (
		<>
			<ActionToolbar>
				<CancelButton action={goBackUrl} />
				<SaveButton action={handleSubmit} col={3} />
			</ActionToolbar>

			<Modal
				className="Modal__Bootstrap modal-dialog operations structures-specification-modal"
				isOpen={blocker.state === 'blocked'}
				ariaHideApp={false}
			>
				<div className="modal-content">
					<div className="modal-header">
						<CloseIconButton onClick={() => blocker.reset()} />
						<h4 className="modal-title">{D.deleteTitle}</h4>
					</div>

					<div className="modal-body">{D.quitWithoutSaving}</div>
					<div className="modal-footer text-right">
						<ActionToolbar>
							<Button action={() => blocker.reset()}>{D.no}</Button>
							<Button action={() => blocker.proceed()}>{D.yes}</Button>
						</ActionToolbar>
					</div>
				</div>
			</Modal>

			<RubricEssentialMsg secondLang={secondLang} />

			<DocumentFormPanel
				opened={lateralPanelOpened}
				onHide={onLateralPanelHide}
			/>

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
											({ value }) => value === idParent,
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
											({ value }) => value === idParent,
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
