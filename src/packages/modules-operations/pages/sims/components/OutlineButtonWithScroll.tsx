import { ReactNode } from "react";
import { useNavigate } from "react-router";

import "./OutlineButtonWithScroll.css";

interface OutlineButtonWithScrollTypes {
  id: string;
  baseUrl: string;
  children: ReactNode;
}

export const OutlineButtonWithScroll = ({
  id,
  baseUrl,
  children,
}: Readonly<OutlineButtonWithScrollTypes>) => {
  const navigate = useNavigate();

  const scrollTo = () => {
    const url = `${baseUrl}#${id}`;
    void navigate(url, { replace: true });
  };

  return (
    <button type="button" className="msd-outline-link" onClick={scrollTo}>
      {children}
    </button>
  );
};
