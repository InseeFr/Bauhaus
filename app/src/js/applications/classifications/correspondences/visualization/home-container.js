import { useSelector } from 'react-redux';
import { Loading } from 'js/new-architecture/components/loading/loading';
import HomeGeneral from './home-general';
import HomeAssociations from './home-associations';
import * as select from 'js/reducers';
import { Stores } from 'js/utils';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from 'js/remote-api/classifications-api';

const CorrespondencesHomeContainer = () => {
	const { id } = useParams();
	const { data: correspondence, isLoading } = useQuery(
		['correspondance-general', id],
		() => api.getCorrespondenceGeneral(id)
	);
	const { data: associations } = useQuery(
		['correspondance-associations', id],
		() => api.getCorrespondenceAssociations(id)
	);

	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);
	const langs = useSelector((state) => select.getLangs(state));

	if (isLoading) return <Loading />;

	return (
		<div className="container">
			<HomeGeneral
				correspondence={correspondence}
				secondLang={secondLang}
				langs={langs}
			/>
			{!associations ? (
				<Loading />
			) : (
				<HomeAssociations
					id={id}
					associations={associations}
					correspondence={correspondence}
					secondLang={secondLang}
				/>
			)}
		</div>
	);
};

export default CorrespondencesHomeContainer;
