import DOMPurify from 'dompurify';
import './panel-html.scss';

function PanelHtml({ title, children, context = 'concepts' }) {
	return (
		<div className={`panel panel-${context}`}>
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
