import { useEffect, useState } from 'react';
import { TextInput } from '../../../../components';
import { AddLogo } from '@components/logo/logo-add';
import D, { D1, D2 } from '../../../../deprecated-locales';
import { getBaseURI } from '@sdk/build-api';
import { sortArray } from '../../../../utils/array-utils';
import { DOCUMENT, isDocument, isLink, LINK } from '../../../document/utils';
import { useDocumentsStoreContext } from '../../pages/sims-creation/documents-store-context';
import './style.scss';
import { DocumentAsideInformation, DocumentLink } from './document-list-item';

/**
 * @typedef {Object} DocumentsBlocProps
 * @property {import('js/types').SimsDocuments[]=}  documents
 * @property {String=} localPrefix
 * @property {Boolean=} editMode
 * @property {(string) => void } deleteHandler
 * @property {(string) => void } addHandler
 * @property {String} objectType
 * @property {String} idMas
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
	idMas,
}) {
	const { documentStores, openLateralPanelOpened, setRubricIdForNewDocument } =
		useDocumentsStoreContext();

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
			objectType === 'documents' ? isDocument(document) : isLink(document),
		)
		.filter((document) =>
			document['label' + localPrefix]
				.toLowerCase()
				.includes(filter.toLowerCase()),
		);

	const isSecondLang = localPrefix === 'Lg2';

	/**
	 * @param {import('js/types').SimsDocuments} document
	 */
	function displayHTMLForDocument(
		document,
		btnBlocFunction = defaultBtnBlocFunction,
	) {
		return (
			<li className="list-group-item documentbloc__item" key={document.uri}>
				<span>
					<DocumentLink
						document={document}
						localPrefix={localPrefix}
						baseURI={baseURI}
					/>

					<DocumentAsideInformation document={document} />
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
				<div className="documentblock__picker panel panel-default">
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
						<button
							type="button"
							className="btn"
							aria-label={D.btnAdd}
							onClick={() => {
								openLateralPanelOpened(
									objectType === 'documents' ? DOCUMENT : LINK,
								);
								setRubricIdForNewDocument({ rubric: idMas, lang: localPrefix });
							}}
						>
							<AddLogo />
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
												<AddLogo />
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
