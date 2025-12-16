import { RequiredIcon } from "../required-icon";

interface InputRmesTypes {
  colMd?: number;
  value: string;
  label: string;
  star?: boolean;
  hiddenStar?: boolean;
  disabled?: boolean;
  password?: boolean;
  handleChange: (value: string) => void;
  arias?: any;
  className?: string;
  errorBlock?: any;
}
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
  className = "",
  errorBlock = <></>,
}: Readonly<InputRmesTypes>) => {
  return (
    <div className={`form-group col-md-${colMd || 12}`}>
      <label className={`form-label ${className}`}>
        {label}
        {star && <RequiredIcon />}
        {hiddenStar && <span className="boldWhite">*</span>}
        <input
          type={password ? "password" : "text"}
          value={value || ""}
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
