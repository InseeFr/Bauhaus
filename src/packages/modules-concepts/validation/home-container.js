import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import ConceptsToValidate from './home';
import { Loading } from '../../components';
import { OK, PENDING } from '../../sdk/constants';
import D from '../../deprecated-locales';
import { ConceptsApi } from '../../sdk';
import { useTitle } from '../../utils/hooks/useTitle';
import { sortArrayByLabel } from '../../utils/array-utils';
import { usePermission } from '../../redux/hooks/usePermission';

const ConceptsToValidateContainer = () => {
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
		return <Redirect to="/concepts" />;
	} else if (exporting === PENDING) {
		return <Loading textType="validating" />;
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

export default ConceptsToValidateContainer;
