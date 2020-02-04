import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
	PageTitle,
	SearchRmes,
	NewButton,
	VerticalMenu,
} from 'bauhaus-library';
import D from 'js/i18n';
import { BOTH, DOCUMENT, LINK, isLink, isDocument } from './utils';
import Auth from 'js/utils/auth/components/auth';
import { INDICATOR_CREATOR, ADMIN, SERIES_CREATOR } from 'js/utils/auth/roles';
import './home.scss';

function DocumentHome({ documents }) {
	const [filter, setFilter] = useState(BOTH);
	const filteredDocuments = documents.filter(document => {
		return (
			filter === BOTH ||
			(filter === DOCUMENT && isDocument(document)) ||
			(filter === LINK && isLink(document))
		);
	});

	return (
		<div className="container documents-home">
			<div className="row">
				<Auth roles={[ADMIN, SERIES_CREATOR, INDICATOR_CREATOR]}>
					<VerticalMenu>
						{[
							['/operations/document/create', D.document],
							['/operations/link/create', D.link],
						].map(([url, title]) => (
							<NewButton
								action={url}
								wrapper={false}
								label={`${D.btnNewMale} ${title}`}
							/>
						))}
					</VerticalMenu>
				</Auth>

				<div className="col-md-8 centered pull-right operations-list">
					<PageTitle title={D.documentsSearchTitle} col={12} offset={0} />
					<div
						className="documents-home__btn-group btn-group btn-group-justified"
						role="group"
					>
						<div className="btn-group" role="group">
							<button
								type="button"
								className={`btn btn-default ${
									filter === DOCUMENT ? 'documents-home__btn-active' : ''
								}`}
								onClick={() => setFilter(DOCUMENT)}
							>
								{D.titleDocument}
							</button>
						</div>
						<div className="btn-group" role="group">
							<button
								type="button"
								className={`btn btn-default ${
									filter === BOTH ? 'documents-home__btn-active' : ''
								}`}
								onClick={() => setFilter(BOTH)}
							>
								{D.titleDocument} / {D.titleLink}
							</button>
						</div>
						<div className="btn-group" role="group">
							<button
								type="button"
								className={`btn btn-default ${
									filter === LINK ? 'documents-home__btn-active' : ''
								}`}
								onClick={() => setFilter(LINK)}
							>
								{D.titleLink}
							</button>
						</div>
					</div>
					<SearchRmes
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
