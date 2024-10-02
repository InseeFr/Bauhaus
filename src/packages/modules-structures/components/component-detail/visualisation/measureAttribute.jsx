import { useEffect, useState } from 'react';
import { MeasureAttributeValue } from './measureAttributeValue';
import { StructureApi } from '../../../../sdk';

export const MeasureAttribute = ({
	attribute,
	value,
	attributes,
	codesLists,
}) => {
	const attributeId = attributes.find((a) => a.iri === attribute)?.id;
	const [fullAttribute, setFullAttribute] = useState();

	useEffect(() => {
		StructureApi.getMutualizedComponent(attributeId).then((body) =>
			setFullAttribute(body),
		);
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
