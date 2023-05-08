import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as select from 'js/reducers';
import { useSelector } from 'react-redux';
import { Loading  } from '@inseefr/wilco';
import OperationsFamilyEdition from 'js/applications/operations/families/edition/edition';
import api from '../../../../remote-api/operations-api';
import { useRedirectWithDefault } from 'bauhaus-utilities';

const OperationsFamilyEditionContainer = () =>  {
	const { id } = useParams();
	const langs = useSelector(state => select.getLangs(state))
	const goBack = useRedirectWithDefault();
	const goBackOrReplace = useRedirectWithDefault(undefined, true);

	const [family, setFamily] = useState({});

	useEffect(() => {
		if(id){
			api.getFamily(id).then(setFamily);
		}
	}, [id]);

	if (!family.id && id) return <Loading />;
	return <OperationsFamilyEdition id={id} family={family} langs={langs} goBackOrReplace={(url, shouldReplace) => {
		if(shouldReplace){
			goBackOrReplace(url)
		} else {
			goBack(url)
		}
	}}/>;
}

export default OperationsFamilyEditionContainer;
