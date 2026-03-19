import { ActionToolbar } from "@components/action-toolbar";
import { ReturnButton } from "@components/buttons/buttons-with-icons";

export const Menu = () => {
  return (
    <ActionToolbar>
      <div className="col-md-2">
        <ReturnButton action="/concepts/administration" />
      </div>
    </ActionToolbar>
  );
};
