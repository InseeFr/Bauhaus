import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SeriesVisualization from './home';
import { Loading } from '../../../../new-architecture/components';
import { useParams } from 'react-router-dom';
import { ClassificationsApi } from '../../../../new-architecture/sdk/classification';
import { getLocales } from '../../../../new-architecture/redux/selectors';
import { getSecondLang } from '../../../../new-architecture/redux/second-lang';

const SeriesVisualizationContainer = () => {
	const { id } = useParams();
	const [series, setSeries] = useState();

	const secondLang = useSelector((state) => getSecondLang(state));
	const langs = useSelector((state) => getLocales(state));
	useEffect(() => {
		Promise.all([
			ClassificationsApi.getSeriesGeneral(id),
			ClassificationsApi.getSeriesMembers(id),
		]).then(([general, members]) => {
			setSeries({
				general: general ?? {},
				members: members ?? [],
			});
		});
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
