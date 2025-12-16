import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import configureStore from "../redux/configure-store";

export const RBACMock = ({
  stamp = "stamp",
  children,
}: PropsWithChildren<{
  stamp?: string;
}>) => {
  const store = configureStore({
    app: {
      auth: {
        type: "type",
        user: {
          stamp,
        },
      },
      lg1: "fr",
      lg2: "en",
    },
  });

  return (
    <Provider store={store}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  );
};
