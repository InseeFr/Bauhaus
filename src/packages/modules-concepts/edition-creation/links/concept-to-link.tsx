import { Row } from '../../../components';
import { Panel } from '../../../components/panel';

type ConceptToLinkTypes = {
	title: string;
	memberEls: JSX.Element[];
	searchComponent: JSX.Element;
};
function ConceptToLink({
	title,
	memberEls,
	searchComponent,
}: Readonly<ConceptToLinkTypes>) {
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
