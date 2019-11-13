import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { I18NContext } from '../context';

const CheckSecondLang = ({ secondLang, onChange }) => {
	const D = useContext(I18NContext);
	return (
		<div className="row">
			<div className="col-md-12">
				<label className="pull-right">
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
