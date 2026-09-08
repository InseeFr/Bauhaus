import { useQuery } from "@tanstack/react-query";

import { useDefaultContributor } from "@utils/creation/use-default-contributor";
import { rmesHtmlToRawHtml } from "@utils/html-utils";
import { MODULES, PRIVILEGES } from "@utils/hooks/users";

import { Concept, ConceptNotes } from "../../model/concepts/concept";
import { ConceptsApi } from "../../sdk";
import { useAuthorizationGuard } from "../../auth/components/auth";
import { emptyConcept } from "../utils/emptyConcept";
import { emptyConceptGeneral } from "../utils/emptyConceptGeneral";
import { emptyConceptNotes } from "../utils/emptyConceptNotes";

const formatNotes = (notes: ConceptNotes): ConceptNotes => ({
  ...emptyConceptNotes,
  ...Object.keys(notes).reduce((formatted: ConceptNotes, noteName) => {
    const key = noteName as keyof ConceptNotes;
    formatted[key] = rmesHtmlToRawHtml(notes[key] ?? "");
    return formatted;
  }, {} as ConceptNotes),
});

export const useConcept = (id: string | undefined) => {
  const isContributor = useAuthorizationGuard({
    module: MODULES.CONCEPT_CONCEPT,
    privilege: PRIVILEGES.CREATE,
  });
  const defaultContributor = useDefaultContributor(isContributor);
  return useQuery<Concept>({
    queryKey: ["concept", id],
    queryFn: async () => {
      const general = await ConceptsApi.getConceptGeneral(id);
      const [notes, links] = await Promise.all([
        ConceptsApi.getNoteVersionList(id, general.conceptVersion),
        ConceptsApi.getConceptLinkList(id),
      ]);
      return {
        general: { ...emptyConceptGeneral(), ...general },
        notes: formatNotes(notes),
        links,
      } satisfies Concept;
    },
    enabled: !!id,
    placeholderData: id ? undefined : emptyConcept(defaultContributor),
  });
};
