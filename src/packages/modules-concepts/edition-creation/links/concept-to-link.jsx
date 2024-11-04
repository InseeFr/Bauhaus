import { Row } from '../../../components';
import { Panel } from '../../../components/panel';

function ConceptToLink({ title, memberEls, searchComponent }) {
	return (
		<Row>
			<div className="col-md-6">
				<Panel title={title}>{memberEls}</Panel>
			</div>
			<div className="col-md-6 text-center">{searchComponent}</div>
		</Row>
	);
}

export default ConceptToLink;
