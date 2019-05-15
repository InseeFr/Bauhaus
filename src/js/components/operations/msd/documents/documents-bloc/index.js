import React, { useState, Component } from 'react';
import { connect } from 'react-redux';
import { sortArray } from 'js/utils/array-utils';
import D from 'js/i18n';
import loadDocuments from 'js/actions/operations/documents/list';
import './style.scss';
import { getLang } from 'js/i18n/build-dictionary';
import { NOT_LOADED, LOADING } from 'js/constants';
import {
	getOperationsDocumentsStatus,
	getOperationsDocuments,
} from 'js/reducers/operations/selector';

import spinner from 'img/spinner.svg';

/**
 * @typedef {Object} DocumentsBlocProps
 * @property {import('js/types').SimsDocuments[]=}  documents
 * @property {String=} localPrefix
 * @property {Boolean=} editMode
 * @property {(string) => void } deleteHandler
 * @property {(string) => void } addHandler
 * @property {import('js/types').SimsDocuments[]} documentStores
 * @property {String} documentStoresStatus
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
}) {
	const [panelStatus, setPanelStatus] = useState(false);
	const [filter, setFilter] = useState('');

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

	function addAsideToTheDocument(document) {
		let lastRefresh;
		if (document.lastRefresh) {
			lastRefresh = new Intl.DateTimeFormat(getLang()).format(
				new Date(document.lastRefresh)
			);
		}
		const aside = [document.lang, lastRefresh].filter(val => !!val).join('-');
		return {
			...document,
			aside,
		};
	}

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

	function displayHTMLForDocument(
		document,
		btnBlocFunction = defaultBtnBlocFunction
	) {
		const label =
			document[`label${localPrefix}`] || document.labelLg1 || document.labelLg2;
		return (
			<li className="list-group-item documentbloc__item" key={document.uri}>
				<span>
					<a
						target="_blank"
						rel="noopener noreferrer"
						href={document.url}
						title={document[`description${localPrefix}`]}
					>
						{label}
					</a>
					<i>({document.aside})</i>
				</span>
				{editMode && !isSecondLang && btnBlocFunction(document)}
			</li>
		);
	}
	return (
		<>
			{documents && documents.length > 0 && (
				<ul className="documentsbloc list-group">
					{currentDocuments
						.map(addAsideToTheDocument)
						.map(document => displayHTMLForDocument(document))}
				</ul>
			)}
			{editMode && !isSecondLang && (
				<div className="panel panel-default">
					<div className="panel-heading">
						<button
							type="button"
							className="btn documentsbloc__add documentsbloc__btn"
							aria-label={D.addDocument}
							onClick={() => setPanelStatus(!panelStatus)}
						>
							<span
								className={`glyphicon glyphicon-menu-${
									panelStatus ? 'down' : 'right'
								}`}
								aria-hidden="true"
							/>
							{D.addDocument}{' '}
							{documentStoresStatus === LOADING ? (
								<img src={spinner} width="30px" alt="loading" />
							) : (
								<span class="badge">{otherDocuments.length}</span>
							)}
						</button>
					</div>
					{panelStatus && (
						<div className="panel-body">
							<div class="form-group">
								<label className="sr-only" for="documentFilter">
									Email address
								</label>
								<input
									className="form-control"
									id="documentFilter"
									placeholder="Searcgh"
									value={filter}
									onChange={e => setFilter(e.target.value)}
								/>
							</div>
							<ul className="documentsbloc__filepicker">
								{otherDocuments.map(addAsideToTheDocument).map(document => {
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

const mapStateToProps = state => {
	return {
		documentStoresStatus: getOperationsDocumentsStatus(state),
		documentStores: getOperationsDocuments(state),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DocumentsBlocContainer);
