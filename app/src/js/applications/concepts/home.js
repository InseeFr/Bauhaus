import React, { useEffect, useState } from 'react';
import {
	PageTitle,
	NewButton,
	PublishButton,
	ExportButton,
	VerticalMenu,
	Loading
} from '@inseefr/wilco';
import check from 'js/utils/auth';
import D from 'js/i18n';
import { useSelector } from 'react-redux';
import { ArrayUtils, Auth, SearchableList } from 'bauhaus-utilities';
import api from '../../remote-api/concepts-api';

const ConceptsHome = () => {
	const permission = useSelector(state => Auth.getPermission(state))
	const [concepts, setConcepts] = useState([])
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		api.getConceptList()
			.then(body => {
				setConcepts(ArrayUtils.sortArrayByLabel(body));
			})
			.finally(() => setLoading(false))
	}, []);

	if (loading) return <Loading />;

	const { authType, roles } = permission;
	const authImpl = check(authType);
	const adminOrContributor = authImpl.isAdminOrContributor(roles);
	const adminOrCreator = authImpl.isAdminOrConceptCreator(roles);
	return (
		<div className="container">
			<div className="row">
				<VerticalMenu>
					{adminOrContributor && (
						<NewButton action="/concept/create" col={8} offset={2} />
					)}
					<ExportButton action="/concepts/export" col={8} offset={2} />
					{adminOrCreator && (
						<PublishButton
							action="/concepts/validation"
							col={8}
							offset={2}
						/>
					)}
				</VerticalMenu>
				<div className="col-md-8 text-center pull-right">
					<PageTitle title={D.conceptSearchTitle} col={12} offset={0} />
					<SearchableList
						items={concepts}
						childPath="concept"
						advancedSearch
						searchUrl="/concepts/search"
						placeholder={D.searchLabelHomePlaceholder}
						autoFocus={true}
					/>
				</div>
			</div>
		</div>
	);
}

export default ConceptsHome;
