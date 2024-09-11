import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loading } from '../../../components';
import OperationsFamilyEdition from '../../../modules-operations/families/edition/edition';
import { useGoBack } from '../../../utils/hooks/useGoBack';
import D from '../../../deprecated-locales/build-dictionary';
import { useTitle } from '../../../utils/hooks/useTitle';
import { OperationsApi } from '../../../sdk/operations-api';
import { useLocales } from '../../../utils/hooks/useLocales';

const OperationsFamilyEditionContainer = () => {
	const { id } = useParams();
	const langs = useLocales();
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
