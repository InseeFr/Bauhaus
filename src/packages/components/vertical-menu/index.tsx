import './index.scss';

export const VerticalMenu = ({
	children = [],
}: Readonly<{ children: any }>) => {
	const buttons = Array.isArray(children) ? children : [children];
	return (
		<div className="col-md-3 btn-group-vertical">
			{buttons.map((child, index) => (
				<div key={index} className="row">
					<div className="col-md-12">{child}</div>
				</div>
			))}
		</div>
	);
};
