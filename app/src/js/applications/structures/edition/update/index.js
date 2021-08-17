import React, { useState, useEffect } from 'react';
import Edition from '../component';
import { Loading } from '@inseefr/wilco';
import { StructureAPI } from 'bauhaus-structures';
import { useLocation, useParams } from 'react-router-dom';
import { useTitle } from 'bauhaus-utilities';
import D from '../../../../i18n/build-dictionary';

const Update = () => {
	const location = useLocation();
	const [loading, setLoading] = useState(true);
	const { dsdId } = useParams();

	const [structure, setStructure] = useState({});
	useTitle(D.structuresTitle, structure?.labelLg1);

	useEffect(() => {
		StructureAPI.getStructure(dsdId)
			.then(res => setStructure(res))
			.finally(() => {
				setLoading(false);
			});
	}, [dsdId]);
	const duplicate = location.pathname.indexOf('/duplicate') >= 0;

	if (loading) return <Loading />;

	if(duplicate){
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
					componentDefinitions: structure.componentDefinitions.map(cd => {
						return {
							component: cd.component,
							order: cd.order,
							required: cd.required,
							attachment: cd.attachment
						}
					})
				}}
			/>
		);
	}

	return (
		<Edition
			creation={duplicate}
			initialStructure={structure}
		/>
	);
};

export default Update;
