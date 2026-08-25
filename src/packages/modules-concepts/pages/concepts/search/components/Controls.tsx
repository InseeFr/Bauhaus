import { ActionToolbar } from "@components/action-toolbar";
import { ResetButton, ReturnButton } from "@components/buttons/buttons-with-icons";

import ExportButtons from "../../../../components/ExportButtons";

interface ControlsProps {
  onClickReturn: () => void;
  initializeState: () => void;
  onExport: (ids: string[], type: string, withConcepts: boolean, lang?: "lg1" | "lg2") => void;
  conceptsList: { id: string }[];
}

const Controls = ({
  onClickReturn,
  initializeState,
  onExport,
  conceptsList,
}: Readonly<ControlsProps>) => (
  <ActionToolbar>
    <ReturnButton action={onClickReturn} />
    <ExportButtons
      exportHandler={(type, withConcepts, lang) =>
        onExport(
          conceptsList.map((c) => c.id),
          type,
          withConcepts,
          lang,
        )
      }
    />
    <ResetButton action={initializeState} />
  </ActionToolbar>
);

export default Controls;
