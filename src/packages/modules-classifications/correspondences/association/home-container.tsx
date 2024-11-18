import { Loading } from '@components/loading';
import AssociationHome from './home';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ClassificationsApi } from '@sdk/classification';
import { useSecondLang } from '@utils/hooks/second-lang';

export const Component = () => {
	const { correspondenceId, associationId } = useParams<{
		correspondenceId: string;
		associationId: string;
	}>();
	const [secondLang] = useSecondLang();

	const { isLoading, data: association } = useQuery({
		queryKey: ['correspondences-association', correspondenceId, associationId],
		queryFn: () =>
			ClassificationsApi.getCorrespondenceAssociation(
				correspondenceId,
				associationId,
			),
	});

	if (isLoading) return <Loading />;
	return <AssociationHome association={association} secondLang={secondLang} />;
};
