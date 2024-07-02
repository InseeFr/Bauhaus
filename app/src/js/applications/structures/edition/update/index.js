import { useState, useEffect } from 'react';
import Edition from '../component';
import { Loading } from 'js/new-architecture/components/loading/loading';
import StructureAPI from '../../apis/structure-api';
import { useLocation, useParams } from 'react-router-dom';
import { useTitle } from 'js/utils';
import D from 'js/i18n';

const Update = () => {
	const location = useLocation();
	const [loading, setLoading] = useState(true);
	const { structureId } = useParams();

	const [structure, setStructure] = useState({});
	useTitle(D.structuresTitle, structure?.labelLg1);

	useEffect(() => {
		StructureAPI.getStructure(structureId)
			.then((res) => setStructure(res))
			.finally(() => {
				setLoading(false);
			});
	}, [structureId]);
	const duplicate = location.pathname.indexOf('/duplicate') >= 0;

	if (loading) return <Loading />;

	if (duplicate) {
		return (
			<Edition
				creation={duplicate}
				initialStructure={{
					identifiant: structure.identifiant,
					labelLg1: structure.labelLg1,
					labelLg2: structure.labelLg2,
					id: '',
					creator: structure.creator,
					contributor: structure.contributor,
					disseminationStatus: structure.disseminationStatus,
					componentDefinitions: structure.componentDefinitions.map((cd) => {
						return {
							component: cd.component,
							order: cd.order,
							required: cd.required,
							attachment: cd.attachment,
						};
					}),
				}}
			/>
		);
	}

	return <Edition creation={duplicate} initialStructure={structure} />;
};

export default Update;
