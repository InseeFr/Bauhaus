import React from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';

const Checkbox = ({ secondLang, onChange }) => (
	<div className="row">
		<div className="col-md-12">
			<label className="pull-right">
				<input type="checkbox" checked={secondLang} onChange={onChange} />{' '}
				{D.displayLg2}
			</label>
		</div>
	</div>
);

Checkbox.propTypes = {
	secondLang: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default Checkbox;
