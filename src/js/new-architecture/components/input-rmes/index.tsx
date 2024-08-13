import { RequiredIcon } from '../required-icon';

type InputRmesTypes = {
	colMd: number;
	value: any;
	label: string;
	star: boolean;
	hiddenStar: boolean;
	disabled: boolean;
	password: boolean;
	handleChange: any;
	arias: any;
	className: string;
	errorBlock: any;
};
export const InputRmes = ({
	colMd,
	value,
	label,
	star,
	hiddenStar,
	disabled,
	password,
	handleChange,
	arias,
	className = '',
	errorBlock = <></>,
}: InputRmesTypes) => {
	return (
		<div className={`form-group col-md-${colMd || 12}`}>
			<label className={`form-label ${className}`}>
				{label}
				{star && <RequiredIcon />}
				{hiddenStar && <span className="boldWhite">*</span>}
				<input
					type={password ? 'password' : 'text'}
					value={value || ''}
					className="form-control"
					disabled={disabled}
					onChange={(e) => handleChange(e.target.value)}
					{...arias}
				/>
			</label>
			{errorBlock}
		</div>
	);
};
