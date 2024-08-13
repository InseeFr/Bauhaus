import { Loading } from '../../../../new-architecture/components';
import AssociationHome from './home';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { ClassificationsApi } from '../../../../new-architecture/sdk/classification';
import { getLocales } from '../../../../new-architecture/redux/selectors';
import { getSecondLang } from '../../../../new-architecture/redux/second-lang';

const AssociationHomeContainer = () => {
	const { correspondenceId, associationId } = useParams();
	const secondLang = useSelector((state) => getSecondLang(state));
	const langs = useSelector((state) => getLocales(state));

	const { isLoading, data: association } = useQuery({
		queryKey: ['correspondences-association', correspondenceId, associationId],
		queryFn: () =>
			ClassificationsApi.getCorrespondenceAssociation(
				correspondenceId,
				associationId
			),
	});

	if (isLoading) return <Loading />;
	return (
		<AssociationHome
			association={association}
			secondLang={secondLang}
			langs={langs}
		/>
	);
};

export default AssociationHomeContainer;
