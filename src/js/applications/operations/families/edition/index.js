import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loading } from '../../../../new-architecture/components';
import OperationsFamilyEdition from '../../../../applications/operations/families/edition/edition';
import api from '../../../../remote-api/operations-api';
import { useGoBack } from '../../../../new-architecture/utils/hooks/useGoBack';
import D from '../../../../i18n/build-dictionary';
import { useTitle } from '../../../../utils';
import { getLocales } from '../../../../new-architecture/redux/selectors';

const OperationsFamilyEditionContainer = () => {
	const { id } = useParams();
	const langs = useSelector((state) => getLocales(state));
	const goBack = useGoBack();

	const [family, setFamily] = useState({});

	useEffect(() => {
		if (id) {
			api.getFamilyById(id).then(setFamily);
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
