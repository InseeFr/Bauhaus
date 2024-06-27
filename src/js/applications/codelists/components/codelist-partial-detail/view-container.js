import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CodesList, Stores } from 'js/utils';
import { formatPartialCodeList } from '../../utils';
import { API } from '../../apis';
import D from '../../i18n/build-dictionary';
import ComponentTitle from '../codelist-detail/title';
import { CodeListPartialDetailView } from './view';
import { useQuery } from '@tanstack/react-query';
import { useGoBack } from '../../../../hooks/hooks';
import {
	Deleting,
	Publishing,
	Loading,
} from '../../../../new-architecture/components/loading/loading';

const CodelistPartialComponentView = (props) => {
	const goBack = useGoBack();
	const secondLang = useSelector(Stores.SecondLang.getSecondLang);
	const { id } = useParams();
	const [deleting, setDeleting] = useState(false);
	const [publishing, setPublishing] = useState(false);
	const [codelists, setCodelists] = useState([]);
	const [modalOpened, setModalOpened] = useState(false);
	const [serverSideError, setServerSideError] = useState('');

	const {
		data: codelist,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ['partial-codes-list', id],
		enabled: codelists.length > 0,
		queryFn: () => {
			return API.getCodelistPartial(id).then((cl) => {
				const idParent = codelists.find(
					(codelist) => codelist.uri === cl.iriParent
				)?.id;

				if (!idParent) {
					return;
				}
				return CodesList.getCodesListCodes(idParent, 1, 0).then((codes) => {
					return formatPartialCodeList(cl, codes.items);
				});
			});
		},
	});

	const publish = () => {
		setPublishing(true);

		API.publishPartialCodelist(id)
			.then(() => {
				return refetch();
			})
			.catch((error) => {
				setServerSideError(error);
			})
			.finally(() => setPublishing(false));
	};

	const handleDelete = () => {
		setDeleting(true);
		API.deleteCodelistPartial(id)
			.then(() => {
				goBack('/codelists');
			})
			.catch((error) => {
				setServerSideError(D['errors_' + JSON.parse(error).code]);
			})
			.finally(() => {
				setDeleting(false);
				setModalOpened(false);
			});
	};

	useEffect(() => {
		API.getCodelists().then((codelists) => {
			setCodelists(Object.values(codelists));
		});
	}, []);

	if (isLoading) {
		return <Loading />;
	}
	if (deleting) return <Deleting />;
	if (publishing) return <Publishing />;

	return (
		<>
			<ComponentTitle component={codelist} secondLang={secondLang} />
			<CodeListPartialDetailView
				{...props}
				col={2}
				codelist={codelist}
				handleBack={() => goBack('/codelists')}
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
		</>
	);
};

export default CodelistPartialComponentView;
