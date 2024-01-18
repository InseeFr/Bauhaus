import React, { useEffect, useState } from 'react';
import { useLocation, useParams, withRouter } from 'react-router-dom';
import * as select from 'js/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { Loading } from '@inseefr/wilco';
import DocumentationEdition from 'js/applications/operations/document/edition/edition';
import { loadCodesList } from 'js/actions/operations/utils/setup';
import api from '../../../../remote-api/api';

const OperationsDocumentationEditionContainer = props => {
	const { id } = useParams();
	const { pathname } = useLocation();
	const type = /(link|document)/.exec(pathname)[1];

	const langs = useSelector(state => select.getLangs(state));
	const langOptions = useSelector(state => state.operationsCodesList.results['ISO-639'] || {});
	const dispatch = useDispatch();

	const [document, setDocument] = useState({ })

	useEffect(() => {
		if(id && type) {
			api.getDocument(id, type).then(results => {
				setDocument({
					...results,
					id: results.uri.substr(results.uri.lastIndexOf('/') + 1),
				})
			})
		}
	}, [id, type])

	useEffect(() => {
		if(!langOptions.notation){
			loadCodesList(['ISO-639'], dispatch)
		}
	}, [langOptions, dispatch])

	if (!document.id && id) return <Loading />;

	return <DocumentationEdition
		langs={langs}
		document={document}
		langOptions={langOptions}
		id={id}
		type={type}
		{...props} />
}

export default withRouter(OperationsDocumentationEditionContainer); // withRouter à supprimer une fois fini
