import { useCallback, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ActionToolbar } from '@components/action-toolbar';
import { Button } from '@components/buttons/button';
import {
	CancelButton,
	CloseIconButton,
} from '@components/buttons/buttons-with-icons';
import { CheckSecondLang } from '@components/check-second-lang';
import { ConfirmationDelete } from '@components/confirmation-delete';
import { CreationUpdateItems } from '@components/creation-update-items';
import { ErrorBloc } from '@components/errors-bloc';
import { Row } from '@components/layout';
import { Note } from '@components/note';
import { Panel } from '@components/panel';
import { PublicationFemale } from '@components/status';

import { OperationsApi } from '@sdk/operations-api';

import { useSecondLang } from '@utils/hooks/second-lang';

import D from '../../../../deprecated-locales';
import * as A from '../../../../redux/actions/constants';
import { RubricEssentialMsg } from '../../rubric-essantial-msg';
import { SimsFieldTitle } from '../../sims-field-title';
import { hasLabelLg2 } from '../../utils';
import { useDocumentsStoreContext } from '../sims-creation/documents-store-context';
import { Menu } from './menu';
import SimsBlock from './sims-block';
import './sims-visualisation.scss';

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
	const { documentStores } = useDocumentsStoreContext();
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
		[publishSims],
	);

	/**
	 * Handle the deletion of a SIMS.
	 */
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const handleNo = () => {
		setModalOpened(false);
	};
	const handleYes = () => {
		OperationsApi.deleteSims(sims).finally(() => {
			dispatch({ type: A.DELETE_SIMS_SUCCESS });
			setModalOpened(false);
			navigate(`/operations/series/${sims.idSeries}`);
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
					className="Modal__Bootstrap modal-dialog operations"
					isOpen={true}
					ariaHideApp={false}
				>
					<div className="modal-content">
						<div className="modal-header">
							<CloseIconButton onClick={() => setExportModalOpened(false)} />
							<h4 className="modal-title">{D.btnExport}</h4>
						</div>

						<div className="modal-body export-modal-body">
							<Row>
								<p className="col-md-offset-1">{D.exportSimsTips}</p>
							</Row>
							<Row>
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
							</Row>
							<Row>
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
							</Row>
							<Row>
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
							</Row>
							<Row>
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
							</Row>
						</div>
						<div className="modal-footer text-right">
							<ActionToolbar>
								<CancelButton action={() => setExportModalOpened(false)} />
								<Button
									disabled={!exportConfig.lg1 && !exportConfig.lg2}
									action={() => {
										exportCallback(sims.id, exportConfig, sims);
										setExportModalOpened(false);
									}}
								>
									{D.btnExportValidate}
								</Button>
							</ActionToolbar>
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
				{missingDocuments?.size > 0 && documentStores && (
					<ErrorBloc
						error={D.missingDocumentWhenExportingSims(
							Array.from(missingDocuments).map(
								(id) => documentStores.find((d) => d.id === id)?.labelLg1,
							),
						)}
						D={D}
					/>
				)}
				<ErrorBloc error={serverSideError} D={D} />
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
