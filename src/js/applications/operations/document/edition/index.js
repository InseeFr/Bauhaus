import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Loading } from '../../../../new-architecture/components';
import DocumentationEdition from '../../../../applications/operations/document/edition/edition';
import { loadCodesList } from '../../../../new-architecture/redux/actions/operations/utils/setup';
import { getLocales } from '../../../../new-architecture/redux/selectors';
import { GeneralApi } from '../../../../new-architecture/sdk/general-api';

const OperationsDocumentationEditionContainer = (props) => {
	const { id } = useParams();
	const { pathname } = useLocation();
	const type = /(link|document)/.exec(pathname)[1];

	const langs = useSelector((state) => getLocales(state));
	const langOptions = useSelector(
		(state) => state.operationsCodesList.results['ISO-639'] || {}
	);
	const dispatch = useDispatch();

	const [document, setDocument] = useState({});

	useEffect(() => {
		if (id && type) {
			GeneralApi.getDocument(id, type).then((results) => {
				setDocument({
					...results,
					id: results.uri.substr(results.uri.lastIndexOf('/') + 1),
				});
			});
		}
	}, [id, type]);

	useEffect(() => {
		if (!langOptions.notation) {
			loadCodesList(['ISO-639'], dispatch);
		}
	}, [langOptions, dispatch]);

	if (!document.id && id) return <Loading />;

	return (
		<DocumentationEdition
			langs={langs}
			document={document}
			langOptions={langOptions}
			id={id}
			type={type}
			{...props}
		/>
	);
};

export default OperationsDocumentationEditionContainer;
