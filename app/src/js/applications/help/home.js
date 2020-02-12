import React from 'react';
import { content as contentConcepts } from './content-concepts';
import { content as contentClassifications } from './content-classifications';
import { content as contentOperations } from './content-operations';
import HelpMenu from './menu';
import { PageTitle, getLang } from '@inseefr/wilco';
import HelpFooter from './footer';
import buildExtract from '@inseefr/wilco/src/utils/build-extract';
import './help.scss';

const getContent = props => {
	const path = props.location.pathname;
	if (path.startsWith('/concepts')) return contentConcepts;
	else if (path.startsWith('/classfications')) return contentClassifications;
	else return contentOperations;
};

const Help = props => {
	const content = getContent(props);
	const id = parseInt(buildExtract('id')(props), 10);
	const selected = content.find(c => c.id === id);
	return (
		<div className="container">
			<div className="row">
				<HelpMenu content={content} selectedId={id} />
				<div className="col-md-9">
					<PageTitle title={selected.title[getLang()]} />
					{selected.body[getLang()]}
					<HelpFooter content={content} selectedId={id} />
				</div>
			</div>
		</div>
	);
};

export default Help;
