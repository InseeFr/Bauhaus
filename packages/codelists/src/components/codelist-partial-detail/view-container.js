import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Loading } from '@inseefr/wilco';
import { Stores, useRedirectWithDefault } from 'bauhaus-utilities';
import { formatPartialCodeList } from '../../utils';
import { API } from '../../apis';
import D from '../../i18n/build-dictionary';
import ComponentTitle from '../codelist-detail/title';
import { CodeListPartialDetailView } from './view';

const CodelistPartialComponentView = (props) => {
	const secondLang = useSelector(Stores.SecondLang.getSecondLang);
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [codelists, setCodelists] = useState([]);
	const [codelist, setCodelist] = useState({});
	const [modalOpened, setModalOpened] = useState(false);
	const [serverSideError, setServerSideError] = useState('');
	const goBack = useRedirectWithDefault();
	const handleBack = goBack('/codelists');

	const handleDelete = useCallback(() => {
		setLoading(true);
		API.deleteCodelistPartial(id)
			.then(() => {
				setLoading(false);
				setModalOpened(false);
				goBack('/codelists');
			})
			.catch((error) => {
				setServerSideError(D['errors_' + JSON.parse(error).code]);
				setLoading(false);
				setModalOpened(false);
			});
	}, [id, goBack]);

	useEffect(() => {
		API.getCodelists().then((codelists) => {
			setCodelists(Object.values(codelists));
		});
	}, []);

	useEffect(() => {
		if (codelists && codelists[0]) {
			API.getCodelistPartial(id)
				.then((cl) => {
					const idParent = codelists.find(
						(codelist) => codelist.uri === cl.iriParent
					).id;
					API.getDetailedCodelist(idParent).then((parentCl) => {
						setCodelist(formatPartialCodeList(cl, parentCl));
					});
				})
				.finally(() => setLoading(false));
		}
	}, [id, codelists]);

	if (loading) {
		return <Loading />;
	}

	return (
		<React.Fragment>
			<ComponentTitle component={codelist} secondLang={secondLang} />
			<CodeListPartialDetailView
				{...props}
				col={2}
				codelist={codelist}
				handleBack={handleBack}
				handleUpdate={`/codelists-partial/${codelist.id}/modify`}
				handleDelete={() => setModalOpened(true)}
				deletable
				modalOpened={modalOpened}
				handleYes={handleDelete}
				handleNo={() => setModalOpened(false)}
				secondLang={secondLang}
				mutualized={true}
				updatable={true}
				serverSideError={serverSideError}
			/>
		</React.Fragment>
	);
};

export default CodelistPartialComponentView;
