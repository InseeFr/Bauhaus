import React from 'react';
import { Panel } from '@inseefr/wilco';

function ConceptToLink({ title, memberEls, searchComponent }) {
	return (
		<div className="row">
			<div className="col-md-6">
				<Panel title={title}>{memberEls}</Panel>
			</div>
			<div className="col-md-6 text-center">{searchComponent}</div>
		</div>
	);
}

export default ConceptToLink;
