import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ClassificationItems from './home';
import { Loading } from '../../../../new-architecture/components';
import { useParams } from 'react-router-dom';
import { ClassificationsApi } from '../../../../new-architecture/sdk/classification';
import { getSecondLang } from '../../../../new-architecture/redux/second-lang';

const ClassificationItemsContainer = () => {
	const { id } = useParams();
	const [items, setItems] = useState();
	const [general, setGeneral] = useState();
	const secondLang = useSelector((state) => getSecondLang(state));

	useEffect(() => {
		Promise.all([
			ClassificationsApi.getClassificationItems(id),
			ClassificationsApi.getClassificationGeneral(id),
		]).then(([items, general]) => {
			setItems(items);
			setGeneral(general);
		});
	}, [id]);
	if (!general || !items) {
		return <Loading />;
	}

	const { prefLabelLg1, prefLabelLg2 } = general;
	const label = secondLang ? 'labelLg2' : 'labelLg1';
	const data =
		(items.length !== 0 &&
			items[0][label] &&
			items.map((n) => ({
				id: n.id,
				label: `${n.id} - ${n[label]}`,
			}))) ||
		[];

	return (
		<ClassificationItems
			items={data}
			subtitle={secondLang ? prefLabelLg2 : prefLabelLg1}
			classificationId={id}
			secondLang={secondLang}
		/>
	);
};

export default ClassificationItemsContainer;
