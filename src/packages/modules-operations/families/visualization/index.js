import D from '../../../deprecated-locales';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
	Loading,
	ErrorBloc,
	PageTitleBlock,
	CheckSecondLang,
} from '../../../components';

import { useCallback, useEffect, useState } from 'react';
import OperationsFamilyVisualization from '../../../modules-operations/families/visualization/visualization';
import { getLocales } from '../../../redux/selectors';
import { getSecondLang } from '../../../redux/second-lang';
import { OperationsApi } from '../../../sdk/operations-api';

import { Menu } from './menu';
const Family = () => {
	const { id } = useParams();
	const langs = useSelector((state) => getLocales(state));
	const secondLang = useSelector((state) => getSecondLang(state));

	const [family, setFamily] = useState({});
	const [serverSideError, setServerSideError] = useState();
	const [publishing, setPublishing] = useState(false);

	useEffect(() => {
		OperationsApi.getFamilyById(id).then(setFamily);
	}, [id]);

	const publish = useCallback(() => {
		setPublishing(true);

		OperationsApi.publishFamily(family)
			.then(() => {
				return OperationsApi.getFamilyById(id).then(setFamily);
			})
			.catch((error) => setServerSideError(error))
			.finally(() => setPublishing(false));
	}, [family, id]);

	if (!family.id) return <Loading />;
	if (publishing) return <Loading text="publishing" />;

	return (
		<div className="container">
			<PageTitleBlock
				titleLg1={family.prefLabelLg1}
				titleLg2={family.prefLabelLg2}
				secondLang={secondLang}
			/>
			<Menu family={family} publish={publish} />
			{serverSideError && <ErrorBloc error={serverSideError} D={D} />}
			`
			<CheckSecondLang />
			<OperationsFamilyVisualization
				secondLang={secondLang}
				attr={family}
				langs={langs}
			/>
		</div>
	);
};
export default Family;
