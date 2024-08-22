import { useState, useEffect, useCallback } from 'react';
import { useGoBack } from '../../../utils/hooks/useGoBack';
import { Loading } from '../../../components';
import { ComponentDetailView } from './view';
import { ConceptsApi, StructureApi } from '../../../sdk';
import ComponentTitle from './title';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSecondLang } from '../../../redux/second-lang';
import { getFormattedCodeList } from '../../apis';

const ViewContainer = (props) => {
	const goBack = useGoBack();

	const secondLang = useSelector(getSecondLang);
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
		StructureApi.deleteMutualizedComponent(id).then(() =>
			goBack('/structures/components')
		);
	}, [id, goBack]);

	useEffect(() => {
		Promise.all([
			StructureApi.getMutualizedComponent(id),
			StructureApi.getMutualizedAttributes(),
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
		return StructureApi.publishMutualizedComponent(component)
			.then(() => StructureApi.getMutualizedComponent(component.id))
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
