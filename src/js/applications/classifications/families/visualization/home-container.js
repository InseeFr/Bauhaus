import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FamilyVisualization from './home';
import { Loading } from '../../../../new-architecture/components';
import { Stores } from '../../../../utils';
import { useParams } from 'react-router-dom';
import { ClassificationsApi } from '../../../../new-architecture/sdk/classification';

const FamilyVisualizationContainer = () => {
	const { id } = useParams();
	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);
	const [family, setFamily] = useState();
	useEffect(() => {
		Promise.all([
			ClassificationsApi.getFamilyGeneral(id),
			ClassificationsApi.getFamilyMembers(id),
		]).then(([general, members]) => {
			setFamily({
				general: general ?? {},
				members: members ?? [],
			});
		});
	}, [id]);

	if (!family) return <Loading />;
	return <FamilyVisualization family={family} secondLang={secondLang} />;
};

export default FamilyVisualizationContainer;
