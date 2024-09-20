import D, { D1, D2 } from '../../../../deprecated-locales';
import { useState, useEffect } from 'react';
import './style.scss';
import { isDocument, isLink } from '../../../document/utils';
import { getBaseURI } from '../../../../sdk';
import { sortArray } from '../../../../utils/array-utils';
import { getLang } from '../../../../utils/dictionnary';
import { useDocumentsStoreContext } from '../../pages/sims-creation/documents-store-context';
import { TextInput } from '../../../../components';
import { AddButton } from '../../../../components/buttons/add';

function getAsideToTheDocument(document) {
	let updatedDate;
	if (document.updatedDate) {
		updatedDate = new Intl.DateTimeFormat(getLang()).format(
			new Date(document.updatedDate)
		);
	}
	return [document.lang, updatedDate].filter((val) => !!val).join('-');
}

/**
 * @typedef {Object} DocumentsBlocProps
 * @property {import('js/types').SimsDocuments[]=}  documents
 * @property {String=} localPrefix
 * @property {Boolean=} editMode
 * @property {(string) => void } deleteHandler
 * @property {(string) => void } addHandler
 * @property {String} objectType
 */

/**
 * This component will display a list of documents associated
 * to a RICH_TEXT typed rubric of a SIMS
 *
 * @param {DocumentsBlocProps} props
 */
export function DocumentsBloc({
	documents = [],
	localPrefix = 'Lg1',
	editMode = false,
	deleteHandler,
	addHandler,
	objectType,
}) {
	const documentStores = useDocumentsStoreContext();

	/**
	 * @param {import('js/types').SimsDocuments} document
	 */
	const defaultBtnBlocFunction = (document) => (
		<button
			type="button"
			className="documentsbloc__delete documentsbloc__btn"
			aria-label={D.btnDelete}
			onClick={() => deleteHandler(document.uri)}
		>
			<span className="glyphicon glyphicon-trash" aria-hidden="true" />
		</button>
	);

	const [panelStatus, setPanelStatus] = useState(false);
	const [filter, setFilter] = useState('');

	const [baseURI, setBaseURI] = useState('');
	useEffect(() => {
		getBaseURI().then((uri) => setBaseURI(uri));
	});

	const currentDocuments = sortArray(`label` + localPrefix)(documents);
	const currentDocumentsIds = currentDocuments.map((doc) => doc.uri);

	const otherDocuments = documentStores[localPrefix.toLowerCase()]
		.filter((document) => !currentDocumentsIds.includes(document.uri))
		.filter((document) => !!document['label' + localPrefix])
		.filter((document) =>
			objectType === 'documents' ? isDocument(document) : isLink(document)
		)
		.filter((document) =>
			document['label' + localPrefix]
				.toLowerCase()
				.includes(filter.toLowerCase())
		);

	const isSecondLang = localPrefix === 'Lg2';

	/**
	 * @param {import('js/types').SimsDocuments} document
	 */
	function displayHTMLForDocument(
		document,
		btnBlocFunction = defaultBtnBlocFunction
	) {
		const id = document.uri.substr(document.uri.lastIndexOf('/') + 1);
		const uri = isDocument(document)
			? `${baseURI}/documents/document/${id}/file`
			: document.url;
		const label =
			document[`label${localPrefix}`] || document.labelLg1 || document.labelLg2;
		return (
			<li className="list-group-item documentbloc__item" key={document.uri}>
				<span>
					<a
						target="_blank"
						rel="noopener noreferrer"
						href={uri}
						title={document[`description${localPrefix}`]}
					>
						{label}
					</a>
					<i> ({getAsideToTheDocument(document)})</i>
				</span>
				{editMode && btnBlocFunction(document)}
			</li>
		);
	}
	const Dictionary = isSecondLang ? D2 : D1;
	const addTitle =
		objectType === 'documents' ? Dictionary.addDocument : Dictionary.addLink;
	const title = objectType === 'documents' ? D.titleDocument : D.titleLink;
	return (
		<>
			{(documents.length > 0 || editMode) && <h4>{title}</h4>}
			{documents && documents.length > 0 && (
				<ul className="documentsbloc list-group">
					{currentDocuments.map((document) => displayHTMLForDocument(document))}
				</ul>
			)}
			{editMode && (
				<div className="panel panel-default">
					<div className="panel-heading">
						<button
							type="button"
							className="btn documentsbloc__add documentsbloc__btn"
							aria-label={addTitle}
							onClick={() => setPanelStatus(!panelStatus)}
						>
							<span
								className={`glyphicon glyphicon-menu-${
									panelStatus ? 'down' : 'right'
								}`}
								aria-hidden="true"
							/>
							{addTitle} <span className="badge">{otherDocuments.length}</span>
						</button>
					</div>
					{panelStatus && (
						<div className="panel-body">
							<div className="form-group">
								<label className="sr-only" htmlFor="documentFilter">
									{D.search}
								</label>
								<TextInput
									id="documentFilter"
									placeholder={D.search}
									value={filter}
									onChange={(e) => setFilter(e.target.value)}
								/>
							</div>
							<ul className="documentsbloc__filepicker">
								{otherDocuments
									.filter((_, index) => index < 100)
									.map((document) => {
										return displayHTMLForDocument(document, (document) => (
											<button
												type="button"
												className="documentsbloc__delete documentsbloc__btn"
												aria-label={D.btnAdd}
												onClick={() => addHandler(document)}
											>
												<AddButton />
											</button>
										));
									})}
							</ul>
						</div>
					)}
				</div>
			)}
		</>
	);
}

export default DocumentsBloc;
