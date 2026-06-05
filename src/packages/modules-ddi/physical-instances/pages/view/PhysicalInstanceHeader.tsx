import { PhysicalInstanceLabel } from "./PhysicalInstanceLabel";
import type {
  PhysicalInstanceUpdateData,
  SelectedGroup,
  SelectedStudyUnit,
} from "../../components/PhysicalInstanceCreationDialog/PhysicalInstanceCreationDialog";

interface PhysicalInstanceHeaderProps {
  label: string;
  onSave: (data: PhysicalInstanceUpdateData) => Promise<void>;
  group?: SelectedGroup;
  studyUnit?: SelectedStudyUnit;
  stamps?: string[];
}

export const PhysicalInstanceHeader = ({
  label,
  onSave,
  group,
  studyUnit,
  stamps,
}: Readonly<PhysicalInstanceHeaderProps>) => {
  return (
    <div className="flex align-items-center gap-2 mb-3">
      <PhysicalInstanceLabel
        label={label}
        onSave={onSave}
        group={group}
        studyUnit={studyUnit}
        stamps={stamps}
      />
    </div>
  );
};
