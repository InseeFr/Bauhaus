import React from 'react';
import { MUTUALIZED_COMPONENT_TYPES } from './constants/';

export const formatLabel = (component) => {
	return (
		<React.Fragment>
			{component.labelLg1}
			<span className="badge badge-pill" style={{ marginLeft: '1em' }}>
				{
					MUTUALIZED_COMPONENT_TYPES.find((c) => c.value === component.type)
						?.label
				}
			</span>
		</React.Fragment>
	);
};
