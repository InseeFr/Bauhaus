import { Row } from '../layout';
import './index.scss';

export const VerticalMenu = ({
	children = [],
}: Readonly<{ children: unknown }>) => {
	const buttons = Array.isArray(children) ? children : [children];
	return (
		<div className="col-md-3 btn-group-vertical">
			{buttons.map((child, index) => (
				<Row key={index}>
					<div className="col-md-12">{child}</div>
				</Row>
			))}
		</div>
	);
};
