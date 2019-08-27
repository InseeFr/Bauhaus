import React from 'react';
import { FormGroup, ControlLabel, Radio } from 'react-bootstrap';

export default ({ id, label, answers, onChange }) => (
	<FormGroup controlId={id}>
		<ControlLabel>{label}</ControlLabel>
		<div className="centered">
			{answers.map(({ value, label: lb }, i) => (
				<Radio
					key={`${id}-${i}`}
					name="radioGroup"
					inline
					onChange={onChange}
					checked={value}
				>
					{lb}
				</Radio>
			))}
		</div>
	</FormGroup>
);
