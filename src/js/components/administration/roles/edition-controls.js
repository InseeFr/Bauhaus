import React from 'react';
import PropTypes from 'prop-types';
import Button from 'js/components/shared/button';
import D from 'js/i18n';

function EditionControls({ setEdition, addAgent, addData }) {
	const disabled = addData.length === 0;
	return (
		<div className="row btn-line">
			<Button label={D.btnReturn} action={() => setEdition(false)} />
			<Button
				label={D.btnAdd}
				action={() => addAgent(addData)}
				disabled={disabled}
				offset={8}
			/>
		</div>
	);
}

EditionControls.propTypes = {
	setEdition: PropTypes.func.isRequired,
	addAgent: PropTypes.func.isRequired,
	addData: PropTypes.array.isRequired,
};

export default EditionControls;
