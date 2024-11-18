import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loading } from '@components/loading';
import OperationsFamilyEdition from '../../../modules-operations/families/edition/edition';
import { useGoBack } from '../../../utils/hooks/useGoBack';
import D from '../../../deprecated-locales/build-dictionary';
import { useTitle } from '../../../utils/hooks/useTitle';
import { OperationsApi } from '../../../sdk/operations-api';
import { Family } from '../../../model/operations/family';

export const Component = () => {
	const { id } = useParams();
	const goBack = useGoBack();

	const [family, setFamily] = useState<Family>({} as Family);

	useEffect(() => {
		if (id) {
			OperationsApi.getFamilyById(id).then(setFamily);
		}
	}, [id]);

	useTitle(D.familiesTitle + ' - ' + D.operationsTitle, family?.prefLabelLg1);

	if (!family.id && id) return <Loading />;
	return <OperationsFamilyEdition id={id} family={family} goBack={goBack} />;
};
