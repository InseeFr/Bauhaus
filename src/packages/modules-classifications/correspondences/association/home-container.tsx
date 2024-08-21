import { Loading } from '../../../components';
import AssociationHome from './home';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { ClassificationsApi } from '../../../sdk/classification';
import { getSecondLang } from '../../../redux/second-lang';

const AssociationHomeContainer = () => {
	const { correspondenceId, associationId } = useParams<{
		correspondenceId: string;
		associationId: string;
	}>();
	const secondLang = useSelector(getSecondLang)! as boolean;

	const { isLoading, data: association } = useQuery({
		queryKey: ['correspondences-association', correspondenceId, associationId],
		queryFn: () =>
			ClassificationsApi.getCorrespondenceAssociation(
				correspondenceId,
				associationId
			),
	});

	if (isLoading) return <Loading />;
	return <AssociationHome association={association} secondLang={secondLang} />;
};

export default AssociationHomeContainer;