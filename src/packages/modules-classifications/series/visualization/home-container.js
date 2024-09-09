import { useEffect, useState } from 'react';
import SeriesVisualization from './home';
import { Loading } from '../../../components';
import { useParams } from 'react-router-dom';
import { ClassificationsApi } from '../../../sdk/classification';
import { useSecondLang } from '../../../utils/hooks/second-lang';
import { useLocales } from '../../../utils/hooks/useLocales';

const SeriesVisualizationContainer = () => {
	const { id } = useParams();
	const [series, setSeries] = useState();

	const [secondLang] = useSecondLang();
	const langs = useLocales();
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
