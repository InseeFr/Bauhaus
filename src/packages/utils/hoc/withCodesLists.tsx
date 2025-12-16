import { useCodesLists } from "../hooks/codeslist";

export const withCodesLists = (notations: string[]) => {
  return (Component: any) => {
    return (props: any) => {
      const codesLists = useCodesLists(notations);
      const codesListsProps = notations.reduce((acc, notation, index) => {
        return {
          ...acc,
          [notation]: codesLists[index].data,
        };
      }, {});
      return <Component {...props} {...codesListsProps} />;
    };
  };
};
