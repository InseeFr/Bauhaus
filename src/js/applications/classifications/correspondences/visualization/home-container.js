import { useSelector } from 'react-redux';
import { Loading } from '../../../../new-architecture/components';
import HomeGeneral from './home-general';
import HomeAssociations from './home-associations';
import { Stores } from '../../../../utils';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ClassificationsApi } from '../../../../new-architecture/sdk/classification';
import { getLocales } from '../../../../new-architecture/redux/selectors';

const CorrespondencesHomeContainer = () => {
	const { id } = useParams();
	const { data: correspondence, isLoading } = useQuery({
		queryKey: ['correspondance-general', id],
		queryFn: () => ClassificationsApi.getCorrespondenceGeneral(id),
	});
	const { data: associations } = useQuery({
		queryKey: ['correspondance-associations', id],
		queryFn: () => ClassificationsApi.getCorrespondenceAssociations(id),
	});

	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);
	const langs = useSelector((state) => getLocales(state));

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
