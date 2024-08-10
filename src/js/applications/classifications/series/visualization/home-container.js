import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SeriesVisualization from './home';
import { Loading } from '../../../../new-architecture/components';
import { Stores } from '../../../../utils';
import { useParams } from 'react-router-dom';
import { ClassificationsApi } from '../../../../new-architecture/sdk/classification';
import { getLocales } from '../../../../new-architecture/redux/selectors';

const SeriesVisualizationContainer = () => {
	const { id } = useParams();
	const [series, setSeries] = useState();

	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);
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
