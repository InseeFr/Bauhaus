import React, { useState, Component } from 'react';
import { connect } from 'react-redux';
import { sortArray } from 'js/utils/array-utils';
import D from 'js/i18n';
import loadDocuments from 'js/actions/operations/documents/list';
import './style.scss';
import { getLang } from 'js/i18n/build-dictionary';
import { LOADED, NOT_LOADED } from 'js/constants';
/**
 * @typedef {Object} DocumentsBlocProps
 * @property {import('js/actions/operations/sims/item').SimsDocuments[]=} documents
 * @property {String=} localPrefix
 * @property {Boolean=} editMode
 * @property {(string) => void } deleteHandler
 * @property {(string) => void } addHandler
 * @property {import('js/actions/operations/sims/item').SimsDocuments[]} documentStores
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
}) {
	const currentDocuments = sortArray(`label${localPrefix}`)(documents);
	const currentDocumentsIds = currentDocuments.map(doc => doc.uri);
	const otherDocuments = sortArray(`label${localPrefix}`)(
		documentStores.filter(
			document => !currentDocumentsIds.includes(document.uri)
		)
	);
	const isSecondLang = localPrefix === 'Lg2';
	const [panelStatus, setPanelStatus] = useState(false);

	function addAsideToTheDocument(document) {
		let updatedDate;
		if (document.updatedDate) {
			updatedDate = new Intl.DateTimeFormat(getLang()).format(
				new Date(document.updatedDate)
			);
		}
		const aside = [document.lang, updatedDate].filter(val => !!val).join('-');
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
		return (
			<li className="list-group-item" key={document.uri}>
				<a
					target="_blank"
					rel="noopener noreferrer"
					href={document.url}
					title={document[`description${localPrefix}`]}
				>
					{document[`label${localPrefix}`]}
				</a>
				<i>({document.aside})</i>
				{editMode && btnBlocFunction(document)}
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

			{editMode && !isSecondLang && otherDocuments.length > 0 && (
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
							{D.addDocument}
						</button>
					</div>
					{panelStatus && (
						<div className="panel-body">
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
		return (
			this.props.documentStoresStatus === LOADED && (
				<DocumentsBloc {...this.props} />
			)
		);
	}
}

const mapDispatchToProps = {
	loadDocuments,
};

const mapStateToProps = state => {
	return {
		documentStoresStatus: state.operationsDocuments.status,
		documentStores: state.operationsDocuments.results,
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DocumentsBlocContainer);
