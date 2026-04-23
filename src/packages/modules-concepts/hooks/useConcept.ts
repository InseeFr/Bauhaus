import { useQuery } from "@tanstack/react-query";

import { rmesHtmlToRawHtml } from "@utils/html-utils";

import { Concept, ConceptNotes } from "../../model/concepts/concept";
import { ConceptsApi } from "../../sdk";
import { useAppContext } from "../../application/app-context";
import emptyConcept from "../utils/empty-concept";
import { empty } from "../utils/general";
import { emptyNotes } from "../utils/notes";

const formatNotes = (notes: ConceptNotes): ConceptNotes => ({
  ...emptyNotes,
  ...Object.keys(notes).reduce((formatted: ConceptNotes, noteName) => {
    const key = noteName as keyof ConceptNotes;
    formatted[key] = rmesHtmlToRawHtml(notes[key] ?? "");
    return formatted;
  }, {} as ConceptNotes),
});

export const useConcept = (id: string | undefined) => {
  const defaultContributor = useAppContext().properties.defaultContributor;
  return useQuery<Concept>({
    queryKey: ["concept", id],
    queryFn: async () => {
      const general = await ConceptsApi.getConceptGeneral(id);
      const [notes, links] = await Promise.all([
        ConceptsApi.getNoteVersionList(id, general.conceptVersion),
        ConceptsApi.getConceptLinkList(id),
      ]);
      return {
        general: { ...empty(), ...general },
        notes: formatNotes(notes),
        links,
      } satisfies Concept;
    },
    enabled: !!id,
    placeholderData: id
      ? undefined
      : (emptyConcept(defaultContributor) as unknown as Concept),
  });
};
