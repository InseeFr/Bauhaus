import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Loading } from '../../../components';
import DocumentationEdition from '../../../modules-operations/document/edition/edition';
import { loadCodesList } from '../../../redux/actions/operations/utils/setup';
import { GeneralApi } from '../../../sdk/general-api';
import { useLocales } from '../../../utils/hooks/useLocales';

const OperationsDocumentationEditionContainer = (props) => {
	const { id } = useParams();
	const { pathname } = useLocation();
	const type = /(link|document)/.exec(pathname)[1];

	const langs = useLocales();
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
