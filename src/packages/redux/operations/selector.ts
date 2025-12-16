export const getOperationsCodesList = (state: any) => {
  const operationsCodesList = state.operationsCodesList || {};
  return operationsCodesList.results || [];
};
