import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SeriesVisualization from './home';
import { Loading } from '@inseefr/wilco';
import * as select from 'js/reducers';
import { Stores } from 'js/utils';
import { useParams } from 'react-router-dom';
import api from '../../../../remote-api/classifications-api';

const SeriesVisualizationContainer = () => {
	const { id } = useParams();
	const [series, setSeries] = useState();

	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);
	const langs = useSelector((state) => select.getLangs(state));
	useEffect(() => {
		Promise.all([api.getSeriesGeneral(id), api.getSeriesMembers(id)]).then(
			([general, members]) => {
				setSeries({
					general: general ?? {},
					members: members ?? [],
				});
			}
		);
	}, [id]);

	if (!series) return <Loading />;
	return (
		<SeriesVisualization
			series={series}
			secondLang={secondLang}
			langs={langs}
		/>
	);
};

export default SeriesVisualizationContainer;
