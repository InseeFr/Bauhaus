import React from 'react';
import DOMPurify from 'dompurify';
import '../panel/panel.css';

function PanelHtml({ title, children, context }) {
	return (
		<div className={`panel panel-${context ? context : 'concepts'}`}>
			<div className="panel-heading">
				<h3 className="panel-title">{title}</h3>
			</div>
			<div className="panel-body">
				<div
					dangerouslySetInnerHTML={{
						__html: DOMPurify.sanitize(children),
					}}
				/>
			</div>
		</div>
	);
}

export default PanelHtml;
