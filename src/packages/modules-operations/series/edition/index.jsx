import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loading } from '@components/loading';
import OperationsSerieEdition from '../../../modules-operations/series/edition/edition';

import { useGoBack } from '@utils/hooks/useGoBack';
import { useCodesList } from '@utils/hooks/codeslist';
import D from '../../../deprecated-locales';
import { useTitle } from '@utils/hooks/useTitle';
import { OperationsApi } from '@sdk/operations-api';
import {
	CL_FREQ,
	CL_SOURCE_CATEGORY,
} from '../../../redux/actions/constants/codeList';
import { useOrganizations } from '@utils/hooks/organizations';

export const Component = (props) => {
	const { id } = useParams();
	const [serie, setSerie] = useState({});

	const [families, setFamilies] = useState([]);
	const [indicators, setIndicators] = useState([]);
	const [series, setSeries] = useState([]);

	const frequencies = useCodesList(CL_FREQ);
	const categories = useCodesList(CL_SOURCE_CATEGORY);
	const { data: organisations } = useOrganizations();

	const goBack = useGoBack();

	useEffect(() => {
		if (id) {
			OperationsApi.getSerie(id).then((results) => setSerie(results));
		}
	}, [id]);

	useEffect(() => {
		OperationsApi.getAllFamilies().then((results) => setFamilies(results));
	}, []);

	useEffect(() => {
		OperationsApi.getAllIndicators().then((results) => setIndicators(results));
	}, []);

	useEffect(() => {
		OperationsApi.getSeriesList().then((results) => setSeries(results));
	}, []);

	useTitle(D.seriesTitle + ' - ' + D.operationsTitle, serie?.prefLabelLg1);

	if (!serie.id && id) return <Loading />;

	return (
		<OperationsSerieEdition
			{...props}
			id={id}
			serie={serie}
			categories={categories}
			organisations={organisations}
			series={series}
			families={families}
			indicators={indicators}
			frequencies={frequencies}
			goBack={goBack}
		/>
	);
};
