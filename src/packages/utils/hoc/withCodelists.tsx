import { useCodelists } from "../hooks/codelist";

export const withCodelists = (notations: string[]) => {
  return (Component: any) => {
    return (props: any) => {
      const codelists = useCodelists(notations);

      const codelistsProps = notations.reduce((acc, notation, index) => {
        return {
          ...acc,
          [notation]: codelists[index].data,
        };
      }, {});

      return <Component {...props} {...codelistsProps} />;
    };
  };
};
