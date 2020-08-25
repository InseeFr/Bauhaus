import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
	PageTitle,
	SearchableList,
	NewButton,
	VerticalMenu,
} from '@inseefr/wilco';
import D from 'js/i18n';
import { BOTH, DOCUMENT, LINK, isLink, isDocument } from './utils';
import Auth from 'js/utils/auth/components/auth';
import {
	ADMIN,
	INDICATOR_CONTRIBUTOR,
	SERIES_CONTRIBUTOR,
} from 'js/utils/auth/roles';
import { FilterToggleButtons, useQueryParam } from 'bauhaus-utilities';
import { useHistory } from 'react-router-dom';

function DocumentHome({ documents }) {
	const history = useHistory();
	const queryMode = useQueryParam('mode');

	const [filter, setFilter] = useState(queryMode || BOTH);
	const filteredDocuments = documents.filter(document => {
		return (
			filter === BOTH ||
			(filter === DOCUMENT && isDocument(document)) ||
			(filter === LINK && isLink(document))
		);
	});

	const onFilter = useCallback(
		mode => {
			setFilter(mode);
			history.push(window.location.pathname + '?page=1&mode=' + mode);
		},
		[history]
	);

	return (
		<div className="container documents-home">
			<div className="row">
				<Auth roles={[ADMIN, INDICATOR_CONTRIBUTOR, SERIES_CONTRIBUTOR]}>
					<VerticalMenu>
						{[
							['/operations/document/create', D.document],
							['/operations/link/create', D.link],
						].map(([url, title], index) => (
							<NewButton
								key={index}
								action={url}
								wrapper={false}
								label={`${D.btnNewMale} ${title}`}
							/>
						))}
					</VerticalMenu>
				</Auth>

				<div className="col-md-8 text-center pull-right operations-list">
					<PageTitle title={D.documentsSearchTitle} col={12} offset={0} />
					<FilterToggleButtons
						currentValue={filter}
						handleSelection={onFilter}
						options={[
							[DOCUMENT, D.titleDocument],
							[BOTH, `${D.titleDocument} / ${D.titleLink}`],
							[LINK, D.titleLink],
						]}
					/>
					<SearchableList
						items={filteredDocuments}
						childPath="operations/document"
						label="label"
						autoFocus={true}
					/>
				</div>
			</div>
		</div>
	);
}

DocumentHome.propTypes = {
	documents: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			uri: PropTypes.string.isRequired,
		}).isRequired
	),
};

export default DocumentHome;
