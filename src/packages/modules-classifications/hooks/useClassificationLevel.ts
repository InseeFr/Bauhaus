import { useQuery } from "@tanstack/react-query";

import { ClassificationsApi } from "@sdk/classification";

interface LevelGeneral {
  id: string;
  classificationId: string;
  prefLabelLg1: string;
  prefLabelLg2?: string;
  [key: string]: unknown;
}

interface LevelMember {
  id: string;
  label: string;
  [key: string]: unknown;
}

interface Level {
  general: LevelGeneral;
  members: LevelMember[];
}

export const useClassificationLevel = (
  classificationId: string,
  levelId: string,
): { isLoading: boolean; level?: Level } => {
  const { isLoading: isLoadingGeneral, data: general } = useQuery<LevelGeneral>({
    queryKey: ["classification-level-general", classificationId, levelId],
    queryFn: () => ClassificationsApi.getClassificationLevelGeneral(classificationId, levelId),
    enabled: !!classificationId && !!levelId,
  });

  const { isLoading: isLoadingMembers, data: members } = useQuery<LevelMember[]>({
    queryKey: ["classification-level-members", classificationId, levelId],
    queryFn: () => ClassificationsApi.getClassificationLevelMembers(classificationId, levelId),
    enabled: !!classificationId && !!levelId,
  });

  const isLoading = isLoadingGeneral || isLoadingMembers;
  const level = general && members ? { general, members } : undefined;

  return { isLoading, level };
};
