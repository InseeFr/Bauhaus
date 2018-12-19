import React from 'react';
import ReactLoading from 'react-loading';
import PropTypes from 'prop-types';
import { getText } from 'js/utils/loading';
import './loading.scss';

const Loading = ({ textType, context }) => {
	const text = getText(textType);
	context = context ? context : 'concepts';
	return (
		<div className="container centered">
			<div className="row loading-row">
				<div className={`col-md-4 col-md-offset-4 loading-${context}`}>
					<ReactLoading
						type="spinningBubbles"
						delay={0}
						height="100%"
						width="100%"
					/>
				</div>
			</div>
			<h3 className={`loading-text-${context}`}>{text}</h3>
		</div>
	);
};

export default Loading;

Loading.propTypes = {
	textType: PropTypes.string,
	context: PropTypes.oneOf(['', 'concepts', 'classifications', 'operations']),
};
