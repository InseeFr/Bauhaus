import { render, screen } from "@testing-library/react";

import { RBACMock } from "../../../tests/rbac";
import { mockReactQueryForRbac } from "../../../tests/render";

describe("Codes List Home Page Menu", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

	it('a user with Gestionnaire_liste_codes_RMESGNCS role can not create a codes list', async () => {
		mockReactQueryForRbac([
			{
				application: 'CODESLIST_CODESLIST',
				privileges: [],
			},
		]);
		const { HomePageMenu } = await import('./menu');

    render(
      <RBACMock>
        <HomePageMenu />
      </RBACMock>,
    );

    expect(screen.queryByText("New")).toBeNull();
  });
});
