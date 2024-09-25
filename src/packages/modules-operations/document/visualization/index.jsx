import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { CheckSecondLang, Loading, PageTitleBlock } from '../../../components';
import { GeneralApi } from '../../../sdk/general-api';
import { useCodesList } from '../../../utils/hooks/codeslist';
import { useSecondLang } from '../../../utils/hooks/second-lang';
import OperationsDocumentVisualization from './home';
import { Menu } from './Menu';

function getPath(path) {
	return path.includes('document') ? 'document' : 'link';
}

export const Component = () => {
	const { id } = useParams();
	const { pathname } = useLocation();
	const type = getPath(pathname);
	const [secondLang] = useSecondLang();
	const langOptions = useCodesList('ISO-639');

	const [document, setDocument] = useState({});
	useEffect(() => {
		GeneralApi.getDocument(id, type).then((results) => {
			setDocument({
				...results,
				id: results.uri.substr(results.uri.lastIndexOf('/') + 1),
			});
		});
	}, [id, type]);

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
				secondLang={secondLang}
				langOptions={langOptions}
				type={type}
			/>
		</div>
	);
};
