import { useState, useEffect, useCallback } from 'react';
import { useGoBack } from '../../../../new-architecture/utils/hooks/useGoBack';
import { Loading } from '../../../../new-architecture/components';
import { ComponentDetailView } from './view';
import api from '../../apis/structure-api';
import { getFormattedCodeList } from '../../apis/code-list';
import { Stores } from '../../../../utils';
import { ConceptsApi } from '../../../../new-architecture/sdk';
import ComponentTitle from './title';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ViewContainer = (props) => {
	const goBack = useGoBack();

	const secondLang = useSelector(Stores.SecondLang.getSecondLang);
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [component, setComponent] = useState({});
	const [concepts, setConcepts] = useState([]);
	const [codesLists, setCodesLists] = useState([]);
	const [serverSideError, setServerSideError] = useState();
	const [attributes, setAttributes] = useState([]);
	const langs = useSelector((state) => {
		const { lg1, lg2 } = state.app;
		return { lg1, lg2 };
	});

	const handleBack = useCallback(
		() => goBack('/structures/components'),
		[goBack]
	);

	const handleDelete = useCallback(() => {
		setLoading(true);
		api
			.deleteMutualizedComponent(id)
			.then(() => goBack('/structures/components'));
	}, [id, goBack]);

	useEffect(() => {
		Promise.all([
			api.getMutualizedComponent(id),
			api.getMutualizedAttributes(),
			ConceptsApi.getConceptList(),
			getFormattedCodeList(),
		])
			.then(([component, attributes, concepts, codesLists]) => {
				setComponent({
					...component,
				});
				setAttributes(attributes);
				setConcepts(concepts);
				setCodesLists(codesLists);
			})
			.finally(() => setLoading(false));
	}, [id]);

	if (loading) {
		return <Loading />;
	}

	const publishComponent = () => {
		setLoading(true);
		return api
			.publishMutualizedComponent(component)
			.then(() => api.getMutualizedComponent(component.id))
			.then((component) => setComponent(component))
			.finally(() => setLoading(false))
			.catch(setServerSideError);
	};
	return (
		<>
			<ComponentTitle component={component} secondLang={secondLang} />

			<ComponentDetailView
				{...props}
				col={2}
				codesLists={codesLists}
				component={component}
				concepts={concepts}
				handleBack={handleBack}
				handleDelete={handleDelete}
				handleUpdate={`/structures/components/${component.id}/modify`}
				mutualized={true}
				updatable={true}
				publishComponent={publishComponent}
				serverSideError={serverSideError}
				secondLang={secondLang}
				attributes={attributes}
				langs={langs}
			/>
		</>
	);
};

export default ViewContainer;
