import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Loading } from '@components/loading';

import { ClassificationsApi } from '@sdk/classification';

import { useSecondLang } from '@utils/hooks/second-lang';

import FamilyVisualization from './home';

export const Component = () => {
	const { id } = useParams();
	const [secondLang] = useSecondLang();
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
