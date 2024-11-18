import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loading, Publishing } from '@components/loading';
import D from '../../deprecated-locales';
import { usePermission } from '../../redux/hooks/usePermission';
import { ConceptsApi } from '../../sdk';
import { OK, PENDING } from '../../sdk/constants';
import { sortArrayByLabel } from '../../utils/array-utils';
import { useTitle } from '../../utils/hooks/useTitle';
import ConceptsToValidate from './home';

export const Component = () => {
	useTitle(D.conceptsTitle, D.btnValid);
	const permission = usePermission();
	const [loading, setLoading] = useState(true);
	const [exporting, setExporting] = useState();
	const [concepts, setConcepts] = useState([]);

	const handleValidateConceptList = (ids) => {
		setExporting(PENDING);
		ConceptsApi.putConceptValidList(ids).finally(() => setExporting(OK));
	};

	useEffect(() => {
		ConceptsApi.getConceptValidateList()
			.then((body) => {
				setConcepts(sortArrayByLabel(body));
			})
			.finally(() => setLoading(false));
	}, []);

	if (exporting === OK) {
		return <Navigate to="/concepts" replace />;
	} else if (exporting === PENDING) {
		return <Publishing />;
	}

	if (loading) return <Loading />;
	return (
		<ConceptsToValidate
			concepts={concepts}
			permission={permission}
			handleValidateConceptList={handleValidateConceptList}
		/>
	);
};
