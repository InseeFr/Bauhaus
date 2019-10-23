import spinner from 'img/spinner.svg';
import loadDocuments from 'js/actions/operations/documents/list';
import { LOADING, NOT_LOADED } from 'js/constants';
import D from 'js/i18n';
import { getLang } from 'js/i18n/build-dictionary';
import {
	getOperationsDocuments,
	getOperationsDocumentsStatus,
} from 'js/reducers/operations/selector';
import { sortArray } from 'js/utils/array-utils';
import React, { Component, useState, useEffect } from 'react';
import { getBaseURI } from 'js/remote-api/build-api';
import { connect } from 'react-redux';
import './style.scss';
import { isDocument } from 'js/components/operations/document/utils';

/**
 * @typedef {Object} DocumentsBlocProps
 * @property {import('js/types').SimsDocuments[]=}  documents
 * @property {String=} localPrefix
 * @property {Boolean=} editMode
 * @property {(string) => void } deleteHandler
 * @property {(string) => void } addHandler
 * @property {import('js/types').SimsDocuments[]} documentStores
 * @property {String} documentStoresStatus
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
	documentStores = [],
	documentStoresStatus,
	objectType,
}) {
	const [panelStatus, setPanelStatus] = useState(false);
	const [filter, setFilter] = useState('');

	const [baseURI, setBaseURI] = useState('');
	useEffect(() => {
		getBaseURI().then(uri => setBaseURI(uri));
	});

	const currentDocuments = sortArray(`label${localPrefix}`)(documents);
	const currentDocumentsIds = currentDocuments.map(doc => doc.uri);

	const otherDocuments = sortArray(`label${localPrefix}`)(
		documentStores
			.filter(document => !currentDocumentsIds.includes(document.uri))
			.filter(document =>
				['', document.labelLg1, document.labelLg2]
					.join()
					.toLowerCase()
					.includes(filter.toLowerCase())
			)
	);
	const isSecondLang = localPrefix === 'Lg2';

	function getAsideToTheDocument(document) {
		let updatedDate;
		if (document.updatedDate) {
			updatedDate = new Intl.DateTimeFormat(getLang()).format(
				new Date(document.updatedDate)
			);
		}
		return [document.lang, updatedDate].filter(val => !!val).join('-');
	}

	/**
	 * @param {import('js/types').SimsDocuments} document
	 */
	const defaultBtnBlocFunction = document => (
		<button
			type="button"
			className="documentsbloc__delete documentsbloc__btn"
			aria-label={D.btnDelete}
			onClick={() => deleteHandler(document.uri)}
		>
			<span className="glyphicon glyphicon-trash" aria-hidden="true" />
		</button>
	);

	/**
	 * @param {import('js/types').SimsDocuments} document
	 */
	function displayHTMLForDocument(
		document,
		btnBlocFunction = defaultBtnBlocFunction
	) {
		const id = document.uri.substr(document.uri.lastIndexOf('/') + 1);
		const uri = isDocument(document)
			? `${baseURI}/documents/document/${id}`
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
				{editMode && !isSecondLang && btnBlocFunction(document)}
			</li>
		);
	}
	const addTitle = objectType === 'documents' ? D.addDocument : D.addLink;
	const title = objectType === 'documents' ? D.titleDocument : D.titleLink;
	return (
		<>
			{(documents.length > 0 || editMode) && <h4>{title}</h4>}
			{documents && documents.length > 0 && (
				<ul className="documentsbloc list-group">
					{currentDocuments.map(document => displayHTMLForDocument(document))}
				</ul>
			)}
			{editMode && !isSecondLang && (
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
							{addTitle}{' '}
							{documentStoresStatus === LOADING ? (
								<img src={spinner} width="30px" alt="loading" />
							) : (
								<span className="badge">{otherDocuments.length}</span>
							)}
						</button>
					</div>
					{panelStatus && (
						<div className="panel-body">
							<div className="form-group">
								<label className="sr-only" htmlFor="documentFilter">
									{D.search}
								</label>
								<input
									className="form-control"
									id="documentFilter"
									placeholder={D.search}
									value={filter}
									onChange={e => setFilter(e.target.value)}
								/>
							</div>
							<ul className="documentsbloc__filepicker">
								{otherDocuments.map(document => {
									return displayHTMLForDocument(document, document => (
										<button
											type="button"
											className="documentsbloc__delete documentsbloc__btn"
											aria-label={D.btnAdd}
											onClick={() => addHandler(document)}
										>
											<span
												className="glyphicon glyphicon-plus"
												aria-hidden="true"
											/>
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

class DocumentsBlocContainer extends Component {
	componentWillMount() {
		if (this.props.documentStoresStatus === NOT_LOADED) {
			this.props.loadDocuments();
		}
	}
	render() {
		return <DocumentsBloc {...this.props} />;
	}
}

const mapDispatchToProps = {
	loadDocuments,
};

/**
 * @param {DocumentsBlocProps} ownProps
 */
const mapStateToProps = (state, ownProps) => {
	return {
		documentStoresStatus: getOperationsDocumentsStatus(state),
		documentStores: getOperationsDocuments(state, ownProps.objectType),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DocumentsBlocContainer);
