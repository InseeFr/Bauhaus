import { useState, useEffect, useCallback } from 'react';
import { goBack } from '@inseefr/wilco';
import { Loading } from '../../../../new-architecture/components/loading/loading';

import { ComponentDetailView } from './view';
import api from '../../apis/structure-api';
import { getFormattedCodeList } from '../../apis/code-list';
import { ConceptsAPI, Stores } from '../../../../utils';
import ComponentTitle from './title';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ViewContainer = (props) => {
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

	const handleBack = useCallback(() => {
		goBack(props, '/structures/components')();
	}, [props]);

	const handleDelete = useCallback(() => {
		setLoading(true);
		api.deleteMutualizedComponent(id).then(() => {
			goBack(props, '/structures/components')();
		});
	}, [id, props]);

	useEffect(() => {
		Promise.all([
			api.getMutualizedComponent(id),
			api.getMutualizedAttributes(),
			ConceptsAPI.getConceptList(),
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
