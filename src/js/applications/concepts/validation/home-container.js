import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import ConceptsToValidate from './home';
import { Loading } from '../../../new-architecture/components';
import { OK, PENDING } from '../../../constants';
import { ArrayUtils, Auth, useTitle } from '../../../utils';
import D from '../../../i18n';
import { ConceptsApi } from '../../../new-architecture/sdk';

const ConceptsToValidateContainer = () => {
	useTitle(D.conceptsTitle, D.btnValid);
	const permission = useSelector((state) => Auth.getPermission(state));
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
				setConcepts(ArrayUtils.sortArrayByLabel(body));
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
