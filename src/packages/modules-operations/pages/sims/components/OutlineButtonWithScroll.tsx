import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

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
    navigate(url, { replace: true });
  };

  return (
    <button type="button" className="btn-link btn" onClick={scrollTo}>
      {children}
    </button>
  );
};
