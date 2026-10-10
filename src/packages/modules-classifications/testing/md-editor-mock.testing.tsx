/**
 * Doublure de `@uiw/react-md-editor/nohighlight` : le Markdown est rendu tel quel.
 * S'utilise avec `vi.mock("@uiw/react-md-editor/nohighlight", () => import("…/md-editor-mock.testing"))`.
 */
const MDEditor = {
  Markdown: ({ source }: { source?: string }) => <div data-testid="markdown">{source}</div>,
};

export default MDEditor;
