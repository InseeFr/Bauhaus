import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as select from 'js/reducers';
import { useSelector } from 'react-redux';
import { Loading } from 'js/new-architecture/components/loading/loading';
import OperationsFamilyEdition from 'js/applications/operations/families/edition/edition';
import api from '../../../../remote-api/operations-api';
import { useGoBack } from 'js/hooks/hooks';

const OperationsFamilyEditionContainer = () => {
	const { id } = useParams();
	const langs = useSelector((state) => select.getLangs(state));
	const goBack = useGoBack();

	const [family, setFamily] = useState({});

	useEffect(() => {
		if (id) {
			api.getFamilyById(id).then(setFamily);
		}
	}, [id]);

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
