import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loading } from '../../../../new-architecture/components';
import OperationsSerieEdition from '../../../../applications/operations/series/edition/edition';
import {
	CL_SOURCE_CATEGORY,
	CL_FREQ,
} from '../../../../actions/constants/codeList';
import api from '../../../../remote-api/operations-api';
import { useGoBack } from '../../../../new-architecture/utils/hooks/useGoBack';
import { useCodesList } from '../../../../new-architecture/utils/hooks/codeslist';
import D from '../../../../i18n';
import { getLocales } from '../../../../new-architecture/redux/selectors';
import { useTitle } from '../../../../new-architecture/utils/hooks/useTitle';

const OperationsSeriesEditionContainer = (props) => {
	const { id } = useParams();
	const [serie, setSerie] = useState({});

	const [families, setFamilies] = useState([]);
	const [indicators, setIndicators] = useState([]);
	const [series, setSeries] = useState([]);

	const frequencies = useCodesList(CL_FREQ);
	const categories = useCodesList(CL_SOURCE_CATEGORY);
	const organisations = useSelector(
		(state) => state.operationsOrganisations.results || []
	);
	const langs = useSelector((state) => getLocales(state));

	const goBack = useGoBack();

	useEffect(() => {
		if (id) {
			api.getSerie(id).then((results) => setSerie(results));
		}
	}, [id]);

	useEffect(() => {
		api.getAllFamilies().then((results) => setFamilies(results));
	}, []);

	useEffect(() => {
		api.getAllIndicators().then((results) => setIndicators(results));
	}, []);

	useEffect(() => {
		api.getSeriesList().then((results) => setSeries(results));
	}, []);

	useTitle(
		D.seriesTitle + ' - ' + D.operationsTitle,
		serie?.prefLabelLg1 || D.seriesCreateTitle
	);

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
			langs={langs}
			frequencies={frequencies}
			goBack={goBack}
		/>
	);
};

export default OperationsSeriesEditionContainer;
