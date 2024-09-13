import { useCallback, useState } from 'react';
import D from '../../../../deprecated-locales';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, CancelButton, Note, Panel } from '@inseefr/wilco';

import * as A from '../../../../redux/actions/constants';

import { hasLabelLg2 } from '../../utils';

import SimsBlock from './sims-block';
import './sims-visualisation.scss';
import Modal from 'react-modal';
import { SimsFieldTitle } from '../../sims-field-title';
import { RubricEssentialMsg } from '../../rubric-essantial-msg';
import {
	CheckSecondLang,
	ConfirmationDelete,
	CreationUpdateItems,
	ErrorBloc,
	PublicationFemale,
	Row,
} from '../../../../components';
import { OperationsApi } from '../../../../sdk/operations-api';
import { Menu } from './menu';
import { useSecondLang } from '../../../../utils/hooks/second-lang';
import { useDocumentsStoreContext } from '../sims-creation/documents-store-context';

export default function SimsVisualisation({
	metadataStructure,
	codesLists,
	sims = {},
	organisations,
	publishSims,
	exportCallback,
	missingDocuments,
	owners = [],
}) {
	const documentStores = useDocumentsStoreContext();
	const [secondLang] = useSecondLang();
	const [modalOpened, setModalOpened] = useState(false);
	const [exportModalOpened, setExportModalOpened] = useState(false);
	const [exportConfig, setExportConfig] = useState({
		emptyMas: true,
		lg1: true,
		lg2: true,
		document: true,
	});

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
						<Panel
							title={
								<SimsFieldTitle
									secondLang={false}
									msd={msd}
									currentSection={sims.rubrics[msd.idMas]}
								/>
							}
						>
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
						<Panel
							title={
								<SimsFieldTitle
									secondLang={true}
									msd={msd}
									currentSection={sims.rubrics[msd.idMas]}
								/>
							}
						>
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

	/**
	 * Handle the deletion of a SIMS.
	 */
	const history = useHistory();
	const dispatch = useDispatch();
	const handleNo = () => {
		setModalOpened(false);
	};
	const handleYes = () => {
		OperationsApi.deleteSims(sims).finally(() => {
			dispatch({ type: A.DELETE_SIMS_SUCCESS });
			setModalOpened(false);
			history.push(`/operations/series/${sims.idSeries}`);
		});
	};

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
							<button
								type="button"
								className="close"
								onClick={() => setExportModalOpened(false)}
							>
								<span aria-hidden="true">&times;</span>
								<span className="sr-only">{D.btnClose}</span>
							</button>
							<h4 className="modal-title">{D.btnExport}</h4>
						</div>

						<div className="modal-body export-modal-body">
							<div className="row">
								<p className="col-md-offset-1">{D.exportSimsTips}</p>
							</div>
							<div className="row">
								<label className="col-md-offset-1">
									<input
										type="checkbox"
										checked={exportConfig.emptyMas}
										onChange={() =>
											setExportConfig({
												...exportConfig,
												emptyMas: !exportConfig.emptyMas,
											})
										}
									/>
									{D.exportSimsIncludeEmptyMas}
								</label>
							</div>
							<div className="row">
								<label className="col-md-offset-1">
									<input
										type="checkbox"
										checked={exportConfig.lg1}
										onChange={() =>
											setExportConfig({
												...exportConfig,
												lg1: !exportConfig.lg1,
											})
										}
									/>
									{D.exportSimsIncludeLg1}
								</label>
							</div>
							<div className="row">
								<label className="col-md-offset-1">
									<input
										type="checkbox"
										checked={exportConfig.lg2}
										onChange={() =>
											setExportConfig({
												...exportConfig,
												lg2: !exportConfig.lg2,
											})
										}
									/>
									{D.exportSimsIncludeLg2}
								</label>
							</div>
							<div className="row">
								<label className="col-md-offset-1">
									<input
										type="checkbox"
										checked={exportConfig.document}
										onChange={() =>
											setExportConfig({
												...exportConfig,
												document: !exportConfig.document,
											})
										}
									/>
									{D.exportDocument}
								</label>
							</div>
						</div>
						<div className="modal-footer text-right">
							<CancelButton
								col={3}
								offset={5}
								action={() => setExportModalOpened(false)}
							/>
							<Button
								disabled={!exportConfig.lg1 && !exportConfig.lg2}
								col={4}
								action={() => {
									exportCallback(sims.id, exportConfig, sims);
									setExportModalOpened(false);
								}}
							>
								{D.btnExportValidate}
							</Button>
						</div>
					</div>
				</Modal>
			)}

			<Menu
				sims={sims}
				owners={owners}
				onExport={() => setExportModalOpened(true)}
				onDelete={() => setModalOpened(true)}
				onPublish={() => publish(sims)}
			/>
			<Row>
				{missingDocuments?.size > 0 && (
					<ErrorBloc
						error={D.missingDocumentWhenExportingSims(
							Array.from(missingDocuments).map(
								(id) => documentStores.find((d) => d.id === id)?.labelLg1
							)
						)}
						D={D}
					/>
				)}
				{serverSideError && <ErrorBloc error={serverSideError} D={D} />}

				<CheckSecondLang />
				<RubricEssentialMsg secondLang={secondLang} />

				<Row>
					<Note
						text={
							<ul>
								<CreationUpdateItems
									creation={sims.created}
									update={sims.updated}
								/>
								<li>
									{D.simsStatus} : <PublicationFemale object={sims} />
								</li>
							</ul>
						}
						title={D.globalInformationsTitle}
						alone={true}
					/>
				</Row>

				{Object.values(metadataStructure).map((msd) => {
					return (
						<MSDInformations key={msd.idMas} msd={msd} firstLevel={true} />
					);
				})}
			</Row>
		</>
	);
}
function shouldDisplayTitleForPrimaryItem(msd) {
	return (
		msd.isPresentational ||
		(!msd.isPresentational && Object.keys(msd.children).length === 0)
	);
}
