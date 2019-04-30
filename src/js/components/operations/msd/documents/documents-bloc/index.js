import React from 'react';
import { sortArray } from 'js/utils/array-utils';
import D from 'js/i18n';

import './style.scss';
import { getLang } from 'js/i18n/build-dictionary';
/**
 * @typedef {Object} DocumentsBlocProps
 * @property {import('js/actions/operations/sims/item').SimsDocuments[]=} documents
 * @property {String=} localPrefix
 * @property {Boolean=} editMode
 */

/**
 * This component will display a list of documents associated
 * to a RICH_TEXT typed rubric of a SIMS
 *
 * @param {DocumentsBlocProps} props
 */
export default function DocumentsBloc({
	documents,
	localPrefix = 'Lg1',
	editMode = false,
}) {
	if (!documents || documents.length === 0) return null;

	return (
		<>
			<ul className="documentsbloc list-group">
				{sortArray(`label${localPrefix}`)(documents).map(document => {
					let updatedDate;
					if (document.updatedDate) {
						updatedDate = new Intl.DateTimeFormat(getLang()).format(
							new Date(document.updatedDate)
						);
					}
					const aside = [document.lang, updatedDate]
						.filter(val => !!val)
						.join('-');

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
							<i>({aside})</i>
							{editMode && (
								<button
									type="button"
									className="documentsbloc__delete documentsbloc__btn"
									aria-label={D.delete}
								>
									<span
										className="glyphicon glyphicon-trash"
										aria-hidden="true"
									/>
								</button>
							)}
						</li>
					);
				})}
			</ul>
			{editMode && (
				<button
					type="button"
					className="btn documentsbloc__add documentsbloc__btn"
					aria-label={D.addDocument}
				>
					<span className="glyphicon glyphicon-plus" aria-hidden="true" />
					{D.addDocument}
				</button>
			)}
		</>
	);
}
