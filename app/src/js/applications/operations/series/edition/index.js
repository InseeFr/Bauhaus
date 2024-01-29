import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import * as select from 'js/reducers';
import { useSelector } from 'react-redux';
import { Loading } from '@inseefr/wilco';
import OperationsSerieEdition from 'js/applications/operations/series/edition/edition';
import { CL_SOURCE_CATEGORY, CL_FREQ } from 'js/actions/constants/codeList';
import api from '../../../../remote-api/operations-api';
import { useQueryCodesList } from 'js/hooks/hooks';

const OperationsSeriesEditionContainer = props => {

	const { id } = useParams();
	const [serie, setSerie] = useState({});

	const [families, setFamilies] = useState([]);
	const [indicators, setIndicators] = useState([]);
	const [series, setSeries] = useState([]);

	const categories = useQueryCodesList(CL_SOURCE_CATEGORY)
	const organisations = useSelector(state => state.operationsOrganisations.results || []);
	const langs = useSelector(state => select.getLangs(state));
	const frequencies = useQueryCodesList(CL_FREQ)

	useEffect(() => {
		if(id){
			api.getSerie(id)
				.then(results => setSerie(results))
		}
	}, [id])

	useEffect(() => {
		api.getFamiliesList()
			.then(results => setFamilies(results))
	}, [])

	useEffect(() => {
		api.getIndicatorsList()
			.then(results => setIndicators(results))
	}, []);

	useEffect(() => {
		api.getSeriesList()
			.then(results => setSeries(results))
	}, [])

	if (!serie.id && id) return <Loading />;
	return <OperationsSerieEdition {...props}
																 id={id}
																 serie={serie}
																 categories={categories}
																 organisations={organisations}
																 series={series} families={families} indicators={indicators} langs={langs} frequencies={frequencies}/>;

}

export default withRouter(OperationsSeriesEditionContainer);
