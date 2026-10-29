/**
 * Options `<option>` natives d'un select mocké, pour piloter options / onChange en test.
 * À charger par `await import(...)` dans une factory `vi.mock`.
 */
export const NativeOptions = ({ options }: { options?: { value: string; label: string }[] }) => (
  <>
    {options?.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </>
);
