import { useCallback, useState } from 'react';
import Modal from 'react-modal';

import { Button } from '@components/buttons/button';
import { CloseIconButton } from '@components/buttons/buttons-with-icons';
import { Row } from '@components/layout';

import D from '../../../deprecated-locales/build-dictionary';
import './index.css';

export const CollectionExportModal = ({ close, ids, exportOdt, exportOds }) => {
	const [lang, setLang] = useState('lg1');
	const [withConcepts, setWithConcepts] = useState(false);

	const handleOdtExportCollectionListCallback = useCallback(
		(MimeType, lang, withConcepts) => {
			exportOdt(ids, MimeType, lang, withConcepts);
		},
		[ids, exportOdt],
	);
	const handleOdsExportCollectionListCallback = useCallback(
		(MimeType, lang, withConcepts) => {
			exportOds(ids, MimeType, lang, withConcepts);
		},
		[ids, exportOds],
	);

	const closeOdt = useCallback(() => {
		handleOdtExportCollectionListCallback(
			'application/vnd.oasis.opendocument.text',
			lang,
			withConcepts,
		);
		close();
	}, [close, handleOdtExportCollectionListCallback, lang, withConcepts]);

	const closeOds = useCallback(() => {
		handleOdsExportCollectionListCallback(
			'application/vnd.oasis.opendocument.text',
			lang,
			withConcepts,
		);
		close();
	}, [close, handleOdsExportCollectionListCallback, lang, withConcepts]);

	return (
		<Modal
			className="Modal__Bootstrap modal-dialog operations collections-modal"
			isOpen={true}
			ariaHideApp={false}
		>
			<div className="modal-content">
				<div className="modal-header">
					<CloseIconButton onClick={close} />
					<h4 className="modal-title">{D.btnExport}</h4>
				</div>

				<div className="modal-body export-modal-body">
					<Row>
						<div className="col-md-offset-1">
							<input
								id="withConcepts"
								type="checkbox"
								checked={withConcepts === true}
								onChange={() => setWithConcepts(!withConcepts)}
							/>
							<label className="col-md-offset-1" htmlFor="withConcepts">
								{D.exportConcepts}
							</label>
						</div>
					</Row>
					<fieldset className="row">
						<legend>{D.exportLgTitle}</legend>
						<div className="col-md-offset-1 form-check">
							<input
								checked={lang === 'lg1'}
								className="form-check-input"
								type="radio"
								name="lang"
								id="lg1"
								onChange={() => setLang('lg1')}
							/>
							<label className="form-check-label col-md-offset-1" htmlFor="lg1">
								{D.exportLg1}
							</label>
						</div>
						<div className="form-check col-md-offset-1">
							<input
								onChange={() => setLang('lg2')}
								checked={lang === 'lg2'}
								className="form-check-input"
								type="radio"
								name="lang"
								id="lg2"
							/>
							<label className="form-check-label col-md-offset-1" htmlFor="lg2">
								{D.exportLg2}
							</label>
						</div>
					</fieldset>
				</div>

				<div className="modal-footer text-right">
					<Button
						col={6}
						action={() => {
							closeOdt();
						}}
					>
						{D.btnOdt}
					</Button>
					<Button
						col={6}
						action={() => {
							closeOds();
						}}
					>
						{D.btnOds}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
