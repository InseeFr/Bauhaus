import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Loading, goBack } from '@inseefr/wilco';
import { CodesList, Stores } from 'bauhaus-utilities';
import { formatPartialCodeList } from '../../utils';
import { API } from '../../apis';
import D from '../../i18n/build-dictionary';
import ComponentTitle from '../codelist-detail/title';
import { CodeListPartialDetailView } from './view';

const CodelistPartialComponentView = (props) => {
	const secondLang = useSelector(Stores.SecondLang.getSecondLang);
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [publishing, setPublishing] = useState(false);
	const [codelists, setCodelists] = useState([]);
	const [codelist, setCodelist] = useState({});
	const [modalOpened, setModalOpened] = useState(false);
	const [serverSideError, setServerSideError] = useState('');

	const handleBack = useCallback(() => {
		goBack(props, '/codelists')();
	}, [props]);

	const fetchCodeList = (id) => {
		return API.getCodelistPartial(id).then((cl) => {
			const idParent = codelists.find(
				(codelist) => codelist.uri === cl.iriParent
			)?.id;

			if (!idParent) {
				return;
			}
			return CodesList.getCodesListCodes(idParent, 1, 0).then((codes) => {
				setCodelist(formatPartialCodeList(cl, codes.items));
			});
		});
	};

	const publish = () => {
		setPublishing(true);

		API.publishPartialCodelist(id)
			.then(() => {
				return fetchCodeList(id);
			})
			.catch((error) => {
				setServerSideError(error);
			})
			.finally(() => setPublishing(false));
	};

	const handleDelete = useCallback(() => {
		setLoading(true);
		API.deleteCodelistPartial(id)
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
		API.getCodelists().then((codelists) => {
			setCodelists(Object.values(codelists));
		});
	}, []);

	useEffect(() => {
		if (codelists && codelists[0]) {
			fetchCodeList(id).finally(() => setLoading(false));
		}
	}, [id, codelists]);

	if (loading) {
		return <Loading />;
	}
	if (publishing) return <Loading text={'publishing'} />;

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
				publishComponent={publish}
			/>
		</React.Fragment>
	);
};

export default CodelistPartialComponentView;
