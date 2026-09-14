import { Link } from "react-router-dom";

import { List } from "../ui/list-group";

interface PickerItemTypes {
  id: string;
  label: string;
  logo: JSX.Element;
  to?: string;
  handleClick?: (id: string) => void;
}

export const PickerItem = ({ id, label, logo, to, handleClick }: Readonly<PickerItemTypes>) => {
  if (handleClick) {
    return (
      <List.Item onClick={() => handleClick(id)}>
        {logo} {label}
      </List.Item>
    );
  }

  if (to) {
    return (
      <List.Item>
        <Link to={to}>{label}</Link>
      </List.Item>
    );
  }

  return <List.Item>{label}</List.Item>;
};
