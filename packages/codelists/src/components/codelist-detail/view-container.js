import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Loading } from '@inseefr/wilco';
import { Stores, useRedirectWithDefault } from 'bauhaus-utilities';
import { formatCodeList } from '../../utils';
import { API } from '../../apis';
import D from '../../i18n/build-dictionary';
import ComponentTitle from './title';
import { CodeListDetailView } from './view';

const CodelistComponentView = (props) => {
	const secondLang = useSelector(Stores.SecondLang.getSecondLang);
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [codelist, setCodelist] = useState({});
	const [modalOpened, setModalOpened] = useState(false);
	const [serverSideError, setServerSideError] = useState('');
	const goBack = useRedirectWithDefault();
	const handleBack = () => goBack('/codelists');

	const handleDelete = useCallback(() => {
		setLoading(true);
		API.deleteCodelist(id)
			.then(() => {
				setLoading(false);
				setModalOpened(false);
				goBack('/codelists')
			})
			.catch((error) => {
				setServerSideError(D['errors_' + JSON.parse(error).code]);
				setLoading(false);
				setModalOpened(false);
			});
	}, [id, goBack]);

	useEffect(() => {
		API.getDetailedCodelist(id)
			.then((cl) => {
				setCodelist(formatCodeList(cl));
			})
			.finally(() => setLoading(false));
	}, [id]);

	if (loading) {
		return <Loading />;
	}

	return (
		<React.Fragment>
			<ComponentTitle component={codelist} secondLang={secondLang} />
			<CodeListDetailView
				{...props}
				col={2}
				codelist={codelist}
				handleBack={handleBack}
				handleUpdate={`/codelists/${codelist.id}/modify`}
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

export default CodelistComponentView;
