import { useSearchParams } from "react-router-dom";

const useUrlQueryParameters = (defaultValue: Record<string, string>) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (property: string, stateChange: string) => {
    const newForm = {
      ...form,
      [property]: stateChange,
    };
    setForm(newForm);
  };

  const reset = () => {
    setSearchParams();
  };

  const setForm = (values: Record<string, string>) => {
    setSearchParams((previous) => ({ ...previous, ...values }));
  };

  let form = defaultValue;
  for (const [key, value] of searchParams.entries()) {
    form = {
      ...form,
      [key]: value,
    };
  }
  return { form, setForm, reset, handleChange };
};

export default useUrlQueryParameters;
