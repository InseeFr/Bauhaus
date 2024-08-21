import { useEffect, useState } from 'react';
import api from '../../../apis/structure-api';
import { MeasureAttributeValue } from './measureAttributeValue';

export const MeasureAttribute = ({
	attribute,
	value,
	attributes,
	codesLists,
}) => {
	const attributeId = attributes.find((a) => a.iri === attribute)?.id;
	const [fullAttribute, setFullAttribute] = useState();

	useEffect(() => {
		api
			.getMutualizedComponent(attributeId)
			.then((body) => setFullAttribute(body));
	}, [attributeId]);

	if (!fullAttribute) {
		return null;
	}

	return (
		<>
			{fullAttribute?.labelLg1}:{' '}
			<MeasureAttributeValue
				value={value}
				attribute={fullAttribute}
				codesLists={codesLists}
			/>
		</>
	);
};
