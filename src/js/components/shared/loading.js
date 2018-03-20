import React from 'react';
import ReactLoading from 'react-loading';
import { getColor, getText } from 'js/utils/loading';
import './loading.css';

export default ({ textType, context }) => {
	const text = getText(textType);
	const color = getColor(context);
	return (
		<div className="container centered">
			<div className="row loading-row">
				<div className="col-md-4 col-md-offset-4">
					<ReactLoading
						type="spinningBubbles"
						delay={0}
						color={color}
						height="100%"
						width="100%"
					/>
				</div>
			</div>
			<h3 style={{ color }}>{text}</h3>
		</div>
	);
};
