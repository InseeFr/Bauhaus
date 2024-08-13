import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loading } from '../../../../new-architecture/components';
import OperationsFamilyEdition from '../../../../applications/operations/families/edition/edition';
import { useGoBack } from '../../../../new-architecture/utils/hooks/useGoBack';
import D from '../../../../i18n/build-dictionary';
import { getLocales } from '../../../../new-architecture/redux/selectors';
import { useTitle } from '../../../../new-architecture/utils/hooks/useTitle';
import { OperationsApi } from '../../../../new-architecture/sdk/operations-api';

const OperationsFamilyEditionContainer = () => {
	const { id } = useParams();
	const langs = useSelector((state) => getLocales(state));
	const goBack = useGoBack();

	const [family, setFamily] = useState({});

	useEffect(() => {
		if (id) {
			OperationsApi.getFamilyById(id).then(setFamily);
		}
	}, [id]);

	useTitle(
		D.familiesTitle + ' - ' + D.operationsTitle,
		family?.prefLabelLg1 || D.familiesCreateTitle
	);

	if (!family.id && id) return <Loading />;
	return (
		<OperationsFamilyEdition
			id={id}
			family={family}
			langs={langs}
			goBack={goBack}
		/>
	);
};

export default OperationsFamilyEditionContainer;
