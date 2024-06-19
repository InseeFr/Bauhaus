import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Loading, goBack } from '@inseefr/wilco';
import { Stores } from 'js/utils';
import { formatCodeList } from '../../utils';
import { API } from '../../apis';
import D from '../../i18n/build-dictionary';
import ComponentTitle from './title';
import { CodeListDetailView } from './view';

const CodelistComponentView = (props) => {
	const secondLang = useSelector(Stores.SecondLang.getSecondLang);
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [publishing, setPublishing] = useState(false);
	const [codelist, setCodelist] = useState({});
	const [modalOpened, setModalOpened] = useState(false);
	const [serverSideError, setServerSideError] = useState('');

	const handleBack = useCallback(() => {
		goBack(props, '/codelists')();
	}, [props]);

	const publish = () => {
		setPublishing(true);

		API.publishCodelist(id)
			.then(() => {
				return API.getDetailedCodelist(id).then((cl) => {
					setCodelist(formatCodeList(cl));
				});
			})
			.catch((error) => {
				setServerSideError(error);
			})
			.finally(() => setPublishing(false));
	};

	const handleDelete = useCallback(() => {
		setLoading(true);
		API.deleteCodelist(id)
			.then(() => {
				setLoading(false);
				setModalOpened(false);
				goBack(props, '/codelists')();
			})
			.catch((error) => {
				setServerSideError(D['errors_' + JSON.parse(error).code]);
				setLoading(false);
				setModalOpened(false);
			});
	}, [id, props]);

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
	if (publishing) return <Loading text={'publishing'} />;

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
				publishComponent={publish}
			/>
		</React.Fragment>
	);
};

export default CodelistComponentView;
