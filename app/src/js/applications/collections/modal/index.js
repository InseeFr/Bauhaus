import D from '../../../i18n/build-dictionary';
import { Button } from '@inseefr/wilco';
import Modal from 'react-modal';
import { useCallback, useState } from 'react';

export const CollectionExportModal = ({ close, ids, exportOdt, exportOds, app = "operations", withConcepts: defaultWithConcepts }) => {
	const [lang, setLang] = useState('lg1');
	const [withConcepts, setWithConcepts] = useState(defaultWithConcepts ?? false);

	const handleOdtExportCollectionListCallback = useCallback(
		(MimeType, lang, withConcepts) => {
			exportOdt(ids, MimeType, lang, withConcepts);
		},
		[ids, exportOdt]
	);
	const handleOdsExportCollectionListCallback = useCallback(
		(MimeType, lang, withConcepts) => {
			exportOds(ids, MimeType, lang, withConcepts);
		},
		[ids, exportOds]
	);

	const closeOdt = useCallback(() => {
		handleOdtExportCollectionListCallback(
			'application/vnd.oasis.opendocument.text',
			lang,
			withConcepts
		);
		close();
	}, [close, handleOdtExportCollectionListCallback, lang, withConcepts]);


	const closeOds = useCallback(() => {
		handleOdsExportCollectionListCallback(
			'application/vnd.oasis.opendocument.text',
			lang,
			withConcepts
		);
		close();
	}, [close, handleOdsExportCollectionListCallback, lang, withConcepts]);

	return (
		<Modal
			className={`Modal__Bootstrap modal-dialog ${app} collections-modal`}
			isOpen={true}
			ariaHideApp={false}
			shouldCloseOnEsc={true}
			shouldCloseOnOverlayClick={true}
			shouldFocusAfterRender={true}
			shouldReturnFocusAfterClose={true}
		>
			<div className="modal-content">
				<div className="modal-header">
					<button type="button" className="close" onClick={() => close()}>
						<span aria-hidden="true">&times;</span>
						<span className="sr-only">{D.btnClose}</span>
					</button>
					<h4 className="modal-title">{D.btnExport}</h4>
				</div>

				<div className="modal-body export-modal-body">
					<div className='row'>
						<div className='col-md-offset-1'>
							<input id="withConcepts" type='checkbox' checked={withConcepts === true} onChange={() => setWithConcepts(!withConcepts)}/>
							<label className="col-md-offset-1" htmlFor="withConcepts">
								{D.exportConcepts}
							</label>
						</div>

					</div>
					<fieldset className='row'>
						<legend>{D.exportLgTitle}</legend>
						<div className="col-md-offset-1 form-check">
							<input checked={lang === 'lg1'} className="form-check-input" type="radio" name="lang" id="lg1"
										 onChange={() => setLang('lg1')} />
							<label className="form-check-label col-md-offset-1" htmlFor="lg1">
								{D.exportLg1}
							</label>
						</div>
						<div className="form-check col-md-offset-1">
							<input onChange={() => setLang('lg2')} checked={lang === 'lg2'} className="form-check-input" type="radio" name="lang" id="lg2"
							/>
							<label className="form-check-label col-md-offset-1" htmlFor="lg2">
								{D.exportLg2}
							</label>
						</div>
					</fieldset>
				</div>



				<div className="modal-footer text-right">
					<Button
						col={6} action={() => {
						closeOdt()
					}}>{D.btnOdt}</Button>
					<Button
						col={6} action={() => {
						closeOds()
					}}>{D.btnOds}</Button>
				</div>

			</div>
		</Modal>
	)
}
