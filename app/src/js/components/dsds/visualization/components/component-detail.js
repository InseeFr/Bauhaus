import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Badge, PageTitle } from 'bauhaus-library';
import ResourceLabel from './resource-label';
import buildExtract from 'js/utils/build-extract';
import API from 'js/remote-api/dsds/dsds-api';
import D from 'js/i18n';
import * as C from 'js/constants';

const ComponentDetails = ({ id, ...props }) => {
	const [component, setComponent] = useState({});

	const dsdId = buildExtract('dsdId')(props);

	useEffect(() => {
		id && API.getDSDComponent(dsdId, id).then(res => setComponent(res));
	}, [id, dsdId]);

	const {
		type,
		labelLg1,
		labelLg2,
		attachment,
		concept,
		codeList,
		range,
	} = component;

	if (!id)
		return <h3 className="centered empty-component">{D.emptyComponent}</h3>;

	return (
		<div>
			<PageTitle
				title={labelLg1}
				subtitle={labelLg2}
				col={12}
				offset={0}
				context="dsds"
			/>
			<div className="centered">
				<Badge type={type} />
			</div>
			<ul>
				{C.ATTACHMENTS.find(a => a.value === attachment) && (
					<li>
						{D.attachmentTitle} :{' '}
						{C.ATTACHMENTS.find(a => a.value === attachment).label}
					</li>
				)}
				<ResourceLabel title={D.conceptTitle} URI={concept} />
				<ResourceLabel title={D.codeListTitle} URI={codeList} />
				<ResourceLabel title={D.rangeTitle} URI={range} />
			</ul>
		</div>
	);
};

export default withRouter(ComponentDetails);
