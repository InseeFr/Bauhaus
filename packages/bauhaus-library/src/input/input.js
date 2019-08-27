import React from 'react';
import {
	FormGroup,
	ControlLabel,
	FormControl,
	InputGroup,
	HelpBlock,
} from 'react-bootstrap';
import Flag from '../flag';

const Input = ({
	id,
	label,
	addOn,
	placeholder,
	value,
	onChange,
	disabled,
	col,
	flag,
	helpMsg,
}) => {
	const flagComponent = flag ? <Flag flag={flag} /> : null;
	return (
		<div className="row">
			<div className={`col-md-${col ? col : '12'}`}>
				<FormGroup controlId={id}>
					{label && (
						<ControlLabel>
							{label} {flag ? '( ' : null} {flagComponent} {flag ? ' )' : null}
						</ControlLabel>
					)}{' '}
					{addOn && (
						<InputGroup>
							<InputGroup.Addon>{addOn}</InputGroup.Addon>
							<FormControl
								componentClass="input"
								placeholder={placeholder}
								value={value}
								onChange={onChange}
								disabled={disabled}
							/>
						</InputGroup>
					)}
					{!addOn && (
						<FormControl
							componentClass="input"
							placeholder={placeholder}
							value={value}
							onChange={onChange}
							disabled={disabled}
						/>
					)}
					{helpMsg && <HelpBlock style={{ color: 'red' }}>{helpMsg}</HelpBlock>}
				</FormGroup>
			</div>
		</div>
	);
};

export default Input;
