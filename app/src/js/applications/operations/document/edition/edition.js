import React, { useMemo, useState } from 'react';
import D, { D1, D2 } from 'js/i18n';
import PropTypes from 'prop-types';
import { EditorMarkdown, PageTitleBlock, withTitle, ErrorBloc } from 'bauhaus-utilities';
import { validate } from 'js/applications/operations/document/edition/validation';
import { LINK, DOCUMENT } from '../utils';
import Dropzone from 'react-dropzone';
import {
	goBack,
	goBackOrReplace,
	Loading,
	CancelButton,
	SaveButton,
	ActionToolbar,
	LabelRequired,
	Select,
} from '@inseefr/wilco';
import DatePickerRmes from 'js/applications/shared/date-picker-rmes';
import api from 'js/remote-api/api';

const initDocument = {
	labelLg1: '',
	labelLg2: '',
	descriptionLg1: '',
	descriptionLg2: '',
	url: '',
	lang: '',
};

const saveDocument = (document, type, files) => {
	const method =
		(document.id ? 'put' : 'post') + (type === LINK ? 'Link' : 'Document');
	let body = document;

	/**
	 * If the document has no id, this is a creation
	 * We have to send FormData kind of HTTP request.
	 * Only File-type document has a file to upload
	 */
	if (!document.id) {
		const formData = new FormData();
		formData.append('body', JSON.stringify(document));

		if (type === DOCUMENT && files[0]) {
			formData.append('file', files[0], files[0].name);
		}
		body = formData;
	}

	let promise;
	if (type === DOCUMENT && document.id && files[0] && files[0].size) {
		const formData = new FormData();
		formData.append('file', files[0], files[0].name);
		promise = (api.putDocumentFile(document, formData), api[method](body));
	} else {
		promise = api[method](body);
	}
	return promise;
};


const OperationsDocumentationEdition = (props) => {
	const { document: documentProps, type, langOptions } = props;

	const defaultDocument = useMemo(() => {
		return {
			...initDocument,
			...documentProps
		}
	}, [documentProps])
	const [serverSideError, setServerSideError] = useState('');
	const [saving, setSaving] = useState(false);
	const [document, setDocument] = useState(defaultDocument);
	const [files, setFiles] = useState(document.url ? [{ name: document.url }] : []);

	const uploadFile = (files) => {
		setServerSideError('');
		setFiles(files);
	};

	const removeFile = () => {
		setServerSideError('');
		setFiles([]);
	}

	const onChange = (e) => {
		setServerSideError('');
		setDocument({
			...document,
			[e.target.id]: e.target.value
		});
	};

	const onSubmit = () => {
		setSaving(true)
		const isCreation = !document.id;

		return saveDocument(document, type, files)
			.then(
				(id = document.id) => {
					goBackOrReplace(props, `/operations/${type}/${id}`, isCreation);
				},
				(err) => {
					setServerSideError(err)
				}
			)
			.finally(() => setSaving(false));
	};

	const langSelectOptions = (langOptions.codes || []).map((lang) => {
		return { value: lang.code, label: lang.labelLg1 };
	});

	if (saving) return <Loading textType="saving" />;

	const isEditing = !!document.id;
	const clientSideErrors = validate(document, type, files);

	let updatedDate;
	if (document.updatedDate) {
		const [year, month, day] = document.updatedDate.split('-');
		updatedDate = `${year}-${month}-${day}T23:00:00.000Z`;
	}

	return (
		<div className="container editor-container">
			{isEditing && (
				<PageTitleBlock
					titleLg1={documentProps.labelLg1}
					titleLg2={documentProps.labelLg2}
					secondLang={true}
				/>
			)}

			<ActionToolbar>
				<CancelButton action={goBack(props, '/operations/documents')} />
				<SaveButton action={onSubmit} disabled={clientSideErrors.errorMessage.length > 0} />
			</ActionToolbar>
			{clientSideErrors && <ErrorBloc error={clientSideErrors.errorMessage} D={D}/>}
			{serverSideError && <ErrorBloc error={serverSideError} D={D}/>}

			<form>
				<div className="row">
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="prefLabelLg1">{D1.title}</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="labelLg1"
							value={document.labelLg1}
							onChange={onChange}
							aria-invalid={clientSideErrors.fields.labelLg1}
						/>
					</div>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="prefLabelLg2">{D2.title}</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="labelLg2"
							value={document.labelLg2}
							onChange={onChange}
							aria-invalid={clientSideErrors.fields.labelLg2}
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 form-group">
						<label htmlFor="abstractLg1">{D1.descriptionTitle}</label>
						<EditorMarkdown
							text={document.descriptionLg1}
							handleChange={(value) =>
								onChange({ target: { value, id: 'descriptionLg1' } })
							}
						/>
					</div>
					<div className="col-md-6 form-group">
						<label htmlFor="abstractLg2">{D2.descriptionTitle}</label>
						<EditorMarkdown
							text={document.descriptionLg2}
							handleChange={(value) =>
								onChange({ target: { value, id: 'descriptionLg2' } })
							}
						/>
					</div>
				</div>
				{type === LINK && (
					<div className="row">
						<div className="col-md-12 form-group">
							<LabelRequired htmlFor="url">{D1.titleLink}</LabelRequired>
							<input
								type="text"
								className="form-control"
								id="url"
								value={document.url}
								onChange={onChange}
								aria-invalid={clientSideErrors.fields.url}
							/>
						</div>
					</div>
				)}
				{type === DOCUMENT && (
					<div className="row">
						<div className="col-md-12 form-group">
							<LabelRequired>{D1.titleUpdatedDate}</LabelRequired>
							<DatePickerRmes
								value={updatedDate}
								onChange={(date) => {
									const value = date && date.split('T')[0];
									onChange({ target: { value, id: 'updatedDate' } });
								}}
								placement="top"
							/>
						</div>
					</div>
				)}
				{type === DOCUMENT && files.length === 0 && (
					<div className="row">
						<div className="col-md-12 form-group">
							<Dropzone onDrop={uploadFile} multiple={false}>
								{({ getRootProps, getInputProps }) => (
									<div
										{...getRootProps({
											className: 'dropzone',
										})}
									>
										<input
											{...getInputProps()}
											aria-invalid={clientSideErrors.fields.file}
										/>
										<p>{D.drag}</p>
									</div>
								)}
							</Dropzone>
						</div>
					</div>
				)}

				{type === DOCUMENT && files.length > 0 && (
					<div className="panel panel-default">
						{files.map((file) => (
							<div className="panel-body" key={file.name}>
								{file.name}
								<button
									onClick={removeFile}
									type="button"
									className="close"
									aria-label="Close"
								>
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
						))}
					</div>
				)}
				<div className="row">
					<div className="col-md-12 form-group">
						<LabelRequired htmlFor="lang">{D1.langTitle}</LabelRequired>

						<Select
							placeholder=""
							unclearable
							value={langSelectOptions.find(
								({ value }) => value === document.lang
							)}
							options={langSelectOptions}
							onChange={(value) => {
								onChange({ target: { value, id: 'lang' } });
							}}
						/>
					</div>
				</div>
			</form>
		</div>
	);
}

OperationsDocumentationEdition.propTypes = {
	document: PropTypes.object.isRequired,
	langs: PropTypes.object.isRequired,
	type: PropTypes.oneOf([LINK, DOCUMENT]),
};

export default withTitle(
	OperationsDocumentationEdition,
	D.operationsTitle,
	(props) => {
		return (
			props.document.labelLg1 ||
			(props.type === LINK ? D.linksCreateTitle : D.documentsCreateTitle)
		);
	}
);
