import { useSelector } from 'react-redux';
import { Loading } from '../../../components';
import HomeGeneral from './home-general';
import HomeAssociations from './home-associations';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ClassificationsApi } from '../../../sdk/classification';
import { getSecondLang } from '../../../redux/second-lang';

const CorrespondencesHomeContainer = () => {
	const { id } = useParams<{ id: string }>();
	const { data: correspondence, isLoading } = useQuery({
		queryKey: ['correspondance-general', id],
		queryFn: () => ClassificationsApi.getCorrespondenceGeneral(id),
	});
	const { data: associations } = useQuery({
		queryKey: ['correspondance-associations', id],
		queryFn: () => ClassificationsApi.getCorrespondenceAssociations(id),
	});

	const secondLang = useSelector<any>(getSecondLang) as boolean;

	if (isLoading) return <Loading />;

	return (
		<div className="container">
			<HomeGeneral correspondence={correspondence} secondLang={secondLang} />
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