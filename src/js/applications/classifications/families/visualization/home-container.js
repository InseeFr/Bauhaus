import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FamilyVisualization from './home';
import { Loading } from '@inseefr/wilco';
import { Stores } from 'js/utils';
import { useParams } from 'react-router-dom';
import api from '../../../../remote-api/classifications-api';

const FamilyVisualizationContainer = () => {
	const { id } = useParams();
	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);
	const [family, setFamily] = useState();
	useEffect(() => {
		Promise.all([api.getFamilyGeneral(id), api.getFamilyMembers(id)]).then(
			([general, members]) => {
				setFamily({
					general: general ?? {},
					members: members ?? [],
				});
			}
		);
	}, [id]);

	if (!family) return <Loading />;
	return <FamilyVisualization family={family} secondLang={secondLang} />;
};

export default FamilyVisualizationContainer;
