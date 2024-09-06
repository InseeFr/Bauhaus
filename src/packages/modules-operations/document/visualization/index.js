import { Loading, PageTitleBlock, CheckSecondLang } from '../../../components';

import { loadCodesList } from '../../../redux/actions/operations/utils/setup';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouteMatch } from 'react-router-dom';
import OperationsDocumentVisualization from './home';

import { getLocales } from '../../../redux/selectors';
import { GeneralApi } from '../../../sdk/general-api';
import { Menu } from './Menu';
import { useSecondLang } from '../../../utils/hooks/second-lang';

function getPath(path) {
	return path.includes('document') ? 'document' : 'link';
}

const DocumentationVisualizationContainer = () => {
	const { id } = useParams();
	const { path } = useRouteMatch();
	const type = getPath(path);
	const langs = useSelector((state) => getLocales(state));
	const [secondLang] = useSecondLang();
	const langOptions = useSelector(
		(state) => state.operationsCodesList.results['ISO-639']
	);
	const dispatch = useDispatch();

	const [document, setDocument] = useState({});
	useEffect(() => {
		GeneralApi.getDocument(id, type).then((results) => {
			setDocument({
				...results,
				id: results.uri.substr(results.uri.lastIndexOf('/') + 1),
			});
		});
	}, [id, type]);

	useEffect(() => {
		if (!langOptions) {
			loadCodesList(['ISO-639'], dispatch);
		}
	}, [langOptions, dispatch]);

	if (!document.id) return <Loading />;

	return (
		<div className="container">
			<PageTitleBlock
				titleLg1={document.labelLg1 || document.labelLg2}
				titleLg2={document.labelLg2}
				secondLang={secondLang}
			/>

			<Menu document={document} type={type} />
			<CheckSecondLang />

			<OperationsDocumentVisualization
				id={id}
				attr={document}
				langs={langs}
				secondLang={secondLang}
				langOptions={langOptions}
				type={type}
			/>
		</div>
	);
};

export default DocumentationVisualizationContainer;
