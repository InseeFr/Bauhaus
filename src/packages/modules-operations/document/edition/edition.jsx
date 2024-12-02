import { useEffect, useMemo, useState } from 'react';
import Dropzone from 'react-dropzone';

import { ActionToolbar } from '@components/action-toolbar';
import {
	CancelButton,
	SaveButton,
} from '@components/buttons/buttons-with-icons';
import { DatePicker } from '@components/date-picker';
import {
	ClientSideError,
	ErrorBloc,
	GlobalClientSideErrorBloc,
} from '@components/errors-bloc';
import { TextInput } from '@components/form/input';
import LabelRequired from '@components/label-required';
import { Row } from '@components/layout';
import { Saving } from '@components/loading';
import { PageTitleBlock } from '@components/page-title-block';
import { EditorMarkdown } from '@components/rich-editor/editor-markdown';
import { Select } from '@components/select-rmes';

import { GeneralApi } from '@sdk/general-api';

import { useDocumentsAndLinks } from '@utils/hooks/documents';
import { useGoBack } from '@utils/hooks/useGoBack';
import { useTitle } from '@utils/hooks/useTitle';

import D, { D1, D2 } from '../../../deprecated-locales';
import { DOCUMENT, LINK } from '../utils';
import { ConfirmationModal } from './confirmation-modal';
import { validate } from './validation';

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
		promise =
			(GeneralApi.putDocumentFile(document, formData),
			GeneralApi[method](body));
	} else {
		promise = GeneralApi[method](body);
	}
	return promise;
};

const OperationsDocumentationEdition = (props) => {
	const { document: documentProps, type, langOptions } = props;

	useTitle(
		type === LINK ? D.titleLink : D.titleDocument,
		props.document.labelLg1,
	);

	const goBack = useGoBack();

	const defaultDocument = useMemo(() => {
		return {
			...initDocument,
			...documentProps,
		};
	}, [documentProps]);

	const [serverSideError, setServerSideError] = useState('');

	const [clientSideErrors, setClientSideErrors] = useState({});

	const [saving, setSaving] = useState(false);

	const [submitting, setSubmitting] = useState(false);

	const [document, setDocument] = useState(defaultDocument);

	const [files, setFiles] = useState(
		document.url ? [{ name: document.url }] : [],
	);

	const [validationModalDisplayed, setValidationModalDisplayed] =
		useState(false);

	const { data: documentsAndLinksList } = useDocumentsAndLinks();

	const [currentDocument, setCurrentDocument] = useState();

	useEffect(() => {
		if (documentsAndLinksList) {
			setCurrentDocument(
				documentsAndLinksList.find((doc) => doc.id === document?.id),
			);
		}
	}, [documentsAndLinksList, document]);

	const currentLabelLg1 = currentDocument?.labelLg1;
	const currentLabelLg2 = currentDocument?.labelLg2;

	const uploadFile = (files) => {
		setServerSideError('');
		setClientSideErrors({
			...clientSideErrors,
			errorMessage: [],
		});
		setFiles(files);
	};

	const removeFile = () => {
		setServerSideError('');
		setClientSideErrors({
			...clientSideErrors,
			errorMessage: [],
		});
		setFiles([]);
	};

	const onChange = (e) => {
		setServerSideError('');
		setClientSideErrors({
			...clientSideErrors,
			errorMessage: [],
		});
		setDocument({
			...document,
			[e.target.id]: e.target.value,
		});
	};

	const saveDocumentOrLink = () => {
		setSaving(true);
		const isCreation = !document.id;
		saveDocument(document, type, files)
			.then(
				(id = document.id) => {
					if (props.onSave) {
						props.onSave(id);
					} else {
						goBack(`/operations/${type}/${id}`, isCreation);
					}
				},
				(err) => {
					setServerSideError(err);
				},
			)
			.finally(() => setSaving(false));
	};

	const onSubmit = () => {
		const documentWithFile = {
			...document,
			files,
		};
		const clientSideErrors = validate(
			documentWithFile,
			type,
			documentsAndLinksList,
			currentLabelLg1,
			currentLabelLg2,
		);
		if (clientSideErrors.errorMessage?.length > 0) {
			setSubmitting(true);
			setClientSideErrors(clientSideErrors);
		} else if (document.sims?.length > 0) {
			setValidationModalDisplayed(true);
		} else {
			saveDocumentOrLink();
		}
	};

	const langSelectOptions = (langOptions.codes || []).map((lang) => {
		return { value: lang.code, label: lang.labelLg1 };
	});

	if (saving) return <Saving />;

	const isEditing = !!document.id;

	let updatedDate;
	if (document.updatedDate) {
		const [year, month, day] = document.updatedDate.split('-');
		updatedDate = `${year}-${month}-${day}T23:00:00.000Z`;
	}

	return (
		<div className="container editor-container">
			<ConfirmationModal
				document={document}
				isOpen={validationModalDisplayed}
				onNo={() => setValidationModalDisplayed(false)}
				onYes={() => {
					saveDocumentOrLink();
					setValidationModalDisplayed(false);
				}}
			/>
			{isEditing && (
				<PageTitleBlock
					titleLg1={documentProps.labelLg1}
					titleLg2={documentProps.labelLg2}
					secondLang={true}
				/>
			)}
			<ActionToolbar>
				<CancelButton
					action={() =>
						props.onCancel ? props.onCancel() : goBack('/operations/documents')
					}
				/>
				<SaveButton
					action={onSubmit}
					disabled={clientSideErrors.errorMessage?.length > 0}
				/>
			</ActionToolbar>
			{submitting && clientSideErrors && (
				<GlobalClientSideErrorBloc
					clientSideErrors={clientSideErrors.errorMessage}
					D={D}
				/>
			)}
			{serverSideError && <ErrorBloc error={serverSideError} D={D} />}
			<form>
				<Row>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="prefLabelLg1">{D1.title}</LabelRequired>
						<TextInput
							id="labelLg1"
							value={document.labelLg1}
							onChange={onChange}
							aria-invalid={!!clientSideErrors.fields?.labelLg1}
							aria-describedby={
								clientSideErrors.fields?.labelLg1 ? 'labelLg1-error' : null
							}
						/>
						<ClientSideError
							id="labelLg1-error"
							error={clientSideErrors?.fields?.labelLg1}
						></ClientSideError>
					</div>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="prefLabelLg2">{D2.title}</LabelRequired>
						<TextInput
							id="labelLg2"
							value={document.labelLg2}
							onChange={onChange}
							aria-invalid={!!clientSideErrors.fields?.labelLg2}
							aria-describedby={
								clientSideErrors.fields?.labelLg2 ? 'labelLg2-error' : null
							}
						/>
						<ClientSideError
							id="labelLg2-error"
							error={clientSideErrors?.fields?.labelLg2}
						></ClientSideError>
					</div>
				</Row>
				<Row>
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
				</Row>
				{type === LINK && (
					<Row>
						<div className="col-md-12 form-group">
							<LabelRequired htmlFor="url">{D1.titleLink}</LabelRequired>
							<TextInput
								id="url"
								value={document.url}
								onChange={onChange}
								aria-invalid={!!clientSideErrors.fields?.url}
								aria-describedby={
									clientSideErrors.fields?.url ? 'url-error' : null
								}
							/>
							<ClientSideError
								id="url-error"
								error={clientSideErrors?.fields?.url}
							></ClientSideError>
						</div>
					</Row>
				)}
				{type === DOCUMENT && (
					<Row>
						<div className="col-md-12 form-group">
							<LabelRequired>{D1.titleUpdatedDate}</LabelRequired>
							<DatePicker
								value={updatedDate}
								onChange={(date) => {
									const value = date && date.split('T')[0];
									onChange({ target: { value, id: 'updatedDate' } });
								}}
								placement="top"
							/>
							<ClientSideError
								id="updatedDate-error"
								error={clientSideErrors?.fields?.updatedDate}
							></ClientSideError>
						</div>
					</Row>
				)}
				{type === DOCUMENT && files.length === 0 && (
					<Row>
						<div className="col-md-12 form-group">
							<LabelRequired>{D.file}</LabelRequired>
							<Dropzone onDrop={uploadFile} multiple={false}>
								{({ getRootProps, getInputProps }) => (
									<div
										{...getRootProps({
											className: 'dropzone',
										})}
									>
										<input
											{...getInputProps()}
											aria-invalid={!!clientSideErrors.fields?.files}
											aria-describedby={
												clientSideErrors.fields?.files ? 'file-error' : null
											}
										/>
										<p>{D.drag}</p>
									</div>
								)}
							</Dropzone>
							<ClientSideError
								id="file-error"
								error={clientSideErrors?.fields?.files}
							></ClientSideError>
						</div>
					</Row>
				)}
				{type === DOCUMENT && files.length > 0 && (
					<div>
						<LabelRequired>{D.file}</LabelRequired>
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
						<ClientSideError
							id="file-error"
							error={clientSideErrors?.fields?.files}
						></ClientSideError>
					</div>
				)}
				<Row>
					<div className="col-md-12 form-group">
						<LabelRequired htmlFor="lang">{D1.langTitle}</LabelRequired>
						<Select
							placeholder=""
							value={langSelectOptions.find(
								({ value }) => value === document.lang,
							)}
							options={langSelectOptions}
							onChange={(value) => {
								onChange({ target: { value, id: 'lang' } });
							}}
						/>
						<ClientSideError
							id="lang-error"
							error={clientSideErrors?.fields?.lang}
						></ClientSideError>
					</div>
				</Row>
			</form>
		</div>
	);
};

export default OperationsDocumentationEdition;
