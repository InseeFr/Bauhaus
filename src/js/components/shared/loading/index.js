import React from 'react';
import ReactLoading from 'react-loading';
import { getText } from 'js/utils/loading';
import './loading.css';

export default ({ textType, context }) => {
	const text = getText(textType);
	return (
		<div className="container centered">
			<div className="row loading-row">
				<div className={`col-md-4 col-md-offset-4 loading-${context}`}>
					<ReactLoading
						type="spinningBubbles"
						delay={0}
						color="pink"
						height="100%"
						width="100%"
					/>
				</div>
			</div>
			<h3 className={`loading-text-${context}`}>{text}</h3>
		</div>
	);
};
