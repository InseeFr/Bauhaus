import React, { useEffect } from 'react';
import {
	PageTitle,
	SearchableList,
	NewButton,
	PublishButton,
	ExportButton,
	VerticalMenu,
	Loading
} from '@inseefr/wilco';
import check from 'js/utils/auth';
import D from 'js/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { Auth } from 'bauhaus-utilities';
import loadConceptList from 'js/actions/concepts/list';
import * as select from 'js/reducers';

const ConceptsHome = () => {
	const permission = useSelector(state => Auth.getPermission(state))
	const concepts = useSelector(state => select.getConceptList(state));
	const dispatch = useDispatch();
	useEffect(() => {
		if (!concepts) {
			dispatch(loadConceptList())
		}
	}, [concepts, dispatch]);
	if (!concepts) return <Loading />;

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
