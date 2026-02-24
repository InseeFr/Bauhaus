import { useState } from "react";

import { TreeContext } from "../../../components/tree/treeContext";
import CodelistEdit from "./components/CodelistEditContainer";

export const Component = () => {
  const [tree, setTree] = useState([]);
  return (
    <TreeContext.Provider value={[tree, setTree]}>
      <CodelistEdit />
    </TreeContext.Provider>
  );
};
