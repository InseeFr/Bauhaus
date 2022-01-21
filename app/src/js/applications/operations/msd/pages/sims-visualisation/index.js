import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import D, { D1 } from 'js/i18n';
import api from 'js/remote-api/operations-api';
import { useHistory } from "react-router-dom";
import { useDispatch} from 'react-redux';
import {
	Button,
	DuplicateButton,
	ErrorBloc,
	Note,
	ActionToolbar,
	ReturnButton,
	Panel,
	ExportButton,
	DeleteButton,
	CancelButton
} from '@inseefr/wilco';

import * as A from 'js/actions/constants';

import {
	Auth,
	ValidationButton,
	CheckSecondLang,
	PublicationFemale,
	ConfirmationDelete, DateUtils,
} from 'bauhaus-utilities';
import {
	hasLabelLg2,
	shouldDisplayDuplicateButton,
	getParentUri,
} from 'js/applications/operations/msd/utils';

import SimsBlock from './sims-block';
import './sims-visualisation.scss';
import Modal from 'react-modal';

export default function SimsVisualisation({
	metadataStructure,
	currentSection,
	codesLists,
	sims = {},
	secondLang,
	goBack,
	organisations,
	publishSims,
	exportCallback,
	owners =  []
}) {
	const shouldDisplayDuplicateButtonFlag = shouldDisplayDuplicateButton(sims);
	const [modalOpened, setModalOpened] = useState(false);
	const [exportModalOpened, setExportModalOpened] = useState(false);
	const [exportConfig, setExportConfig] = useState({
		emptyMas: true,
		lg1: true,
		lg2: true
	})

	function MSDInformations({ msd, firstLevel = false }) {
		return (
			<>
				{firstLevel && shouldDisplayTitleForPrimaryItem(msd) && (
					<h3 className="col-md-12 sims-title">
						{msd.idMas} - {msd.masLabelBasedOnCurrentLang}
					</h3>
				)}
				<div className="sims-row" key={msd.idMas} id={msd.idMas}>
					{!msd.isPresentational && (
						<Panel title={`${msd.idMas} - ${msd.masLabelLg1}`}>
							<SimsBlock
								msd={msd}
								isSecondLang={false}
								currentSection={sims.rubrics[msd.idMas]}
								unbounded={msd.maxOccurs === 'unbounded'}
								codesLists={codesLists}
								organisations={organisations}
							/>
						</Panel>
					)}
					{!msd.isPresentational && hasLabelLg2(msd) && secondLang && (
						<Panel title={`${msd.idMas} - ${msd.masLabelLg2}`}>
							<SimsBlock
								msd={msd}
								isSecondLang={true}
								currentSection={sims.rubrics[msd.idMas]}
								unbounded={msd.maxOccurs === 'unbounded'}
								codesLists={codesLists}
								organisations={organisations}
							/>
						</Panel>
					)}
				</div>
				{Object.values(msd.children).map((child) => (
					<MSDInformations key={child.idMas} msd={child} />
				))}
			</>
		);
	}

	/*
	 * The publication button should be enabled only if RICH_TEXT value do not
	 * have unsupported styles like STRIKETHROUGH, color or background color
	 */
	const publicationDisabled = false;


	const [serverSideError, setServerSideError] = useState();
	const publish = useCallback(
		(object) => {
			publishSims(object, (err) => {
				if (err) {
					setServerSideError(err);
				}
			});
		},
		[publishSims]
	);

	const checkStamp = stamp => owners.includes(stamp);

	/**
	 * Handle the deletion of a SIMS.
	 */
	const history = useHistory();
	const dispatch = useDispatch();
	const handleNo = () => {
		setModalOpened(false);
	}
	const handleYes = () => {
		api.deleteSims(sims)
			.finally(async () => {
				await dispatch({ type: A.DELETE_SIMS_SUCCESS })
				setModalOpened(false);
				history.push(`/operations/series/${sims.idSeries}`)
			})
	}
	const CREATOR = sims.idIndicator
		? [Auth.INDICATOR_CONTRIBUTOR, checkStamp]
		: [Auth.SERIES_CONTRIBUTOR, checkStamp];
	return (
		<>
			{modalOpened && (
				<ConfirmationDelete
					className="operations"
					handleNo={handleNo}
					handleYes={handleYes}
					message={D.confirmationDocumentationDelete}
				/>
			)}
			{exportModalOpened && (
				<Modal
					className={`Modal__Bootstrap modal-dialog operations`}
					isOpen={true}
					ariaHideApp={false}
				>
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" onClick={() => setExportModalOpened(false)}>
								<span aria-hidden="true">&times;</span>
								<span className="sr-only">{D.btnClose}</span>
							</button>
							<h4 className="modal-title">{D.btnExport}</h4>
						</div>

						<div className="modal-body export-modal-body">
							<div className='row'>
								<p className="col-md-offset-1">{D.exportSimsTips}</p>
							</div>
							<div className='row'>
								<label className="col-md-offset-1">
									<input type='checkbox' checked={exportConfig.emptyMas}
												 onChange={() => setExportConfig({ ...exportConfig, emptyMas: !exportConfig.emptyMas})}/>
												 {D.exportSimsIncludeEmptyMas}
								</label>
							</div>
							<div className='row'>
								<label className="col-md-offset-1">
									<input type='checkbox' checked={exportConfig.lg1}
												 onChange={() => setExportConfig({ ...exportConfig, lg1: !exportConfig.lg1})}/>
									{D.exportSimsIncludeLg1}</label>
							</div>
							<div className='row'>
								<label className="col-md-offset-1">
									<input type='checkbox' checked={exportConfig.lg2}
												 onChange={() => setExportConfig({ ...exportConfig, lg2: !exportConfig.lg2})}/>
									{D.exportSimsIncludeLg2}</label>
							</div>
						</div>
						<div className="modal-footer text-right">
							<CancelButton col={3} offset={5} action={() => setExportModalOpened(false)} />
							<Button
								disabled={!exportConfig.lg1 && !exportConfig.lg2}
								col={4} action={() => {
								exportCallback(sims.id, exportConfig, sims)
								setExportModalOpened(false)
							}}>{D.btnExportValidate}</Button>
						</div>
					</div>
				</Modal>
			)}
			<ActionToolbar>
				<ReturnButton action={() => goBack(getParentUri(sims))} />
				<Auth.AuthGuard
					roles={[Auth.ADMIN, CREATOR]}
					complementaryCheck={shouldDisplayDuplicateButtonFlag}
				>
					<DuplicateButton
						action={`/operations/sims/${sims.id}/duplicate`}
						col={3}
					/>
				</Auth.AuthGuard>
				<Auth.AuthGuard roles={[Auth.ADMIN]} complementaryCheck={!!sims.idSeries}>
					<DeleteButton
						action={() => setModalOpened(true)}
					/>
				</Auth.AuthGuard>
				<Auth.AuthGuard
					roles={[
						Auth.ADMIN,
						CREATOR
					]}
				>
					<ValidationButton
						object={sims}
						callback={(object) => publish(object)}
						disabled={publicationDisabled}
					/>
					<Button
						action={`/operations/sims/${sims.id}/modify`}
						label={
							<>
								<span
									className="glyphicon glyphicon-floppy-disk"
									aria-hidden="true"
								/>
								<span> {D.btnUpdate}</span>
							</>
						}
					/>
				</Auth.AuthGuard>
				<ExportButton action={() => setExportModalOpened(true)} />
			</ActionToolbar>

			<ErrorBloc error={serverSideError} />

			<CheckSecondLang />

			<div className="row">
				<Note
					text={
						<ul>
							<li>
								{D1.createdDateTitle} : {DateUtils.stringToDate(sims.created)}
							</li>
							<li>
								{D1.modifiedDateTitle} : {DateUtils.stringToDate(sims.modified)}
							</li>
							<li>
								{D.simsStatus} : <PublicationFemale object={sims} />
							</li>
						</ul>
					}
					title={D.globalInformationsTitle}
					alone={true}
				/>
			</div>

			{Object.values(metadataStructure).map((msd) => {
				if (currentSection && msd.idMas !== currentSection) {
					return null;
				}
				return <MSDInformations key={msd.idMas} msd={msd} firstLevel={true} />;
			})}
		</>
	);
}
function shouldDisplayTitleForPrimaryItem(msd) {
	return (
		msd.isPresentational ||
		(!msd.isPresentational && Object.keys(msd.children).length === 0)
	);
}
SimsVisualisation.propTypes = {
	metadataStructure: PropTypes.object.isRequired,
	currentSection: PropTypes.string,
	codesLists: PropTypes.object.isRequired,
	sims: PropTypes.object.isRequired,
	goBack: PropTypes.func,
};
