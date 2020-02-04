import React from 'react';
import PropTypes from 'prop-types';
import './second-lang-checkbox.scss';
import D from '../build-dictionary';
const CheckSecondLang = ({ secondLang, onChange }) => {
	return (
		<div className="row bauhaus-second-lang-checkbox">
			<div className="col-md-10 centered col-md-offset-1">
				<label>
					<input type="checkbox" checked={secondLang} onChange={onChange} />{' '}
					{D.displayLg2}
				</label>
			</div>
		</div>
	);
};

CheckSecondLang.propTypes = {
	secondLang: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default CheckSecondLang;
