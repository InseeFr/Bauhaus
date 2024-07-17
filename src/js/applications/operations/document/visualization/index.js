import { Button, ActionToolbar, ReturnButton } from '@inseefr/wilco';
import { Loading } from '../../../../new-architecture/components/loading/loading';

import { useGoBack } from '../../../../hooks/hooks';
import {
	Auth,
	CheckSecondLang,
	Stores,
	PageTitleBlock,
} from '../../../../utils';
import { loadCodesList } from '../../../../actions/operations/utils/setup';

import D from '../../../../i18n';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouteMatch } from 'react-router-dom';
import OperationsDocumentVisualization from './home';
import { ADMIN } from '../../../../utils/auth/roles';
import api from '../../../../remote-api/api';
import * as select from '../../../../reducers';

function getPath(path) {
	return path.includes('document') ? 'document' : 'link';
}

const checkContributorRight = (document) => {
	return (stamp) => {
		const sims = document.sims;
		if (sims?.length === 0) {
			return true;
		}
		const stamps = sims.map(({ creators }) => creators);
		for (let i = 1; i < stamps.length; i++) {
			// we first check if all stamps array have the same size.
			if (stamps[i - 1].length !== stamps[i].length) {
				return false;
			}
			if (
				stamps[i - 1].length > 0 &&
				stamps[i - 1].filter((s) => stamps[i].includes(s)).length === 0
			) {
				return false;
			}
		}
		return stamps[0].includes(stamp);
	};
};

const DocumentationVisualizationContainer = () => {
	const { id } = useParams();
	const { path } = useRouteMatch();
	const type = getPath(path);
	const langs = useSelector((state) => select.getLangs(state));
	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);
	const langOptions = useSelector(
		(state) => state.operationsCodesList.results['ISO-639']
	);
	const dispatch = useDispatch();
	const goBack = useGoBack();

	const [document, setDocument] = useState({});
	useEffect(() => {
		api.getDocument(id, type).then((results) => {
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

			<ActionToolbar>
				<ReturnButton action={() => goBack('/operations/documents')} />

				<Auth.AuthGuard
					roles={[
						ADMIN,
						[Auth.SERIES_CONTRIBUTOR, checkContributorRight(document)],
						[Auth.INDICATOR_CONTRIBUTOR, checkContributorRight(document)],
					]}
				>
					<Button
						action={`/operations/${type}/${document.id}/modify`}
						label={D.btnUpdate}
					/>
				</Auth.AuthGuard>
			</ActionToolbar>
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
