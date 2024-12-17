import { Link } from 'react-router-dom';

interface PickerItemTypes {
	id: string;
	label: string;
	logo: JSX.Element;
	to: string;
	handleClick: (id: string) => void;
}
export const PickerItem = ({
	id,
	label,
	logo,
	to,
	handleClick,
}: Readonly<PickerItemTypes>) => {
	if (handleClick) {
		return (
			<li className="list-group-item" onClick={() => handleClick(id)}>
				{logo} {label}
			</li>
		);
	}
	if (to) {
		return (
			<li className="list-group-item">
				<Link to={to}>{label}</Link>
			</li>
		);
	}
	return <li className="list-group-item">{label}</li>;
};
