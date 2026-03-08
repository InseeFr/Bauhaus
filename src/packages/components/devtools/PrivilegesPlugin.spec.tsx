import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivilegesPlugin } from "./PrivilegesPlugin";
import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";

describe("PrivilegesPlugin", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("should render all modules with dropdowns for each privilege", () => {
    render(<PrivilegesPlugin />, { wrapper });

    expect(screen.getByText("Privileges Override (DevTools)")).toBeInTheDocument();

    Object.values(MODULES).forEach((module) => {
      expect(screen.getByText(module)).toBeInTheDocument();
      Object.values(PRIVILEGES).forEach((privilege) => {
        expect(screen.getByTestId(`privilege-${module}-${privilege}`)).toBeInTheDocument();
      });
    });
  });

  it("should initialize with NONE strategy for all privileges when no privileges exist", () => {
    render(<PrivilegesPlugin />, { wrapper });

    Object.values(MODULES).forEach((module) => {
      Object.values(PRIVILEGES).forEach((privilege) => {
        const dropdown = screen.getByTestId(
          `privilege-${module}-${privilege}`,
        ) as HTMLSelectElement;
        expect(dropdown.value).toBe(STRATEGIES.NONE);
      });
    });
  });

  it("should initialize with existing privileges from query cache", () => {
    queryClient.setQueryData(
      ["users"],
      [
        {
          application: MODULES.DDI_PHYSICALINSTANCE,
          privileges: [
            { privilege: PRIVILEGES.READ, strategy: STRATEGIES.ALL },
            { privilege: PRIVILEGES.UPDATE, strategy: STRATEGIES.NONE },
            { privilege: PRIVILEGES.CREATE, strategy: STRATEGIES.ALL },
            { privilege: PRIVILEGES.DELETE, strategy: STRATEGIES.NONE },
            { privilege: PRIVILEGES.PUBLISH, strategy: STRATEGIES.ALL },
            { privilege: PRIVILEGES.ADMINISTRATION, strategy: STRATEGIES.NONE },
          ],
        },
      ],
    );

    render(<PrivilegesPlugin />, { wrapper });

    const readDropdown = screen.getByTestId(
      `privilege-${MODULES.DDI_PHYSICALINSTANCE}-${PRIVILEGES.READ}`,
    ) as HTMLSelectElement;
    expect(readDropdown.value).toBe(STRATEGIES.ALL);

    const updateDropdown = screen.getByTestId(
      `privilege-${MODULES.DDI_PHYSICALINSTANCE}-${PRIVILEGES.UPDATE}`,
    ) as HTMLSelectElement;
    expect(updateDropdown.value).toBe(STRATEGIES.NONE);

    const createDropdown = screen.getByTestId(
      `privilege-${MODULES.DDI_PHYSICALINSTANCE}-${PRIVILEGES.CREATE}`,
    ) as HTMLSelectElement;
    expect(createDropdown.value).toBe(STRATEGIES.ALL);
  });

  it("should update query cache when a specific privilege strategy changes", () => {
    render(<PrivilegesPlugin />, { wrapper });

    const dropdown = screen.getByTestId(
      `privilege-${MODULES.DDI_PHYSICALINSTANCE}-${PRIVILEGES.UPDATE}`,
    ) as HTMLSelectElement;

    fireEvent.change(dropdown, { target: { value: STRATEGIES.ALL } });

    const updatedPrivileges = queryClient.getQueryData(["users"]);
    expect(updatedPrivileges).toBeDefined();
    expect(Array.isArray(updatedPrivileges)).toBe(true);

    const ddiPrivilege = (updatedPrivileges as any[])?.find(
      (p) => p.application === MODULES.DDI_PHYSICALINSTANCE,
    );

    expect(ddiPrivilege).toBeDefined();
    expect(ddiPrivilege.privileges).toBeDefined();

    const updatePriv = ddiPrivilege.privileges.find((p: any) => p.privilege === PRIVILEGES.UPDATE);
    expect(updatePriv.strategy).toBe(STRATEGIES.ALL);
  });

  it("should allow different strategies for different privileges within the same module", () => {
    render(<PrivilegesPlugin />, { wrapper });

    const readDropdown = screen.getByTestId(
      `privilege-${MODULES.DDI_PHYSICALINSTANCE}-${PRIVILEGES.READ}`,
    ) as HTMLSelectElement;
    const updateDropdown = screen.getByTestId(
      `privilege-${MODULES.DDI_PHYSICALINSTANCE}-${PRIVILEGES.UPDATE}`,
    ) as HTMLSelectElement;

    fireEvent.change(readDropdown, { target: { value: STRATEGIES.ALL } });
    fireEvent.change(updateDropdown, { target: { value: STRATEGIES.NONE } });

    expect(readDropdown.value).toBe(STRATEGIES.ALL);
    expect(updateDropdown.value).toBe(STRATEGIES.NONE);

    const updatedPrivileges = queryClient.getQueryData(["users"]) as any[];
    const ddiPrivilege = updatedPrivileges.find(
      (p) => p.application === MODULES.DDI_PHYSICALINSTANCE,
    );

    const readPriv = ddiPrivilege.privileges.find((p: any) => p.privilege === PRIVILEGES.READ);
    const updatePriv = ddiPrivilege.privileges.find((p: any) => p.privilege === PRIVILEGES.UPDATE);

    expect(readPriv.strategy).toBe(STRATEGIES.ALL);
    expect(updatePriv.strategy).toBe(STRATEGIES.NONE);
  });

  it("should render ALL and NONE options in dropdowns", () => {
    render(<PrivilegesPlugin />, { wrapper });

    expect(screen.getAllByText("ALL").length).toBeGreaterThan(0);
    expect(screen.getAllByText("NONE").length).toBeGreaterThan(0);
  });

  it("should display warning note about temporary changes", () => {
    render(<PrivilegesPlugin />, { wrapper });

    expect(
      screen.getByText(/These changes only affect the current browser session/i),
    ).toBeInTheDocument();
  });

  it("should allow changing privileges across different modules independently", () => {
    render(<PrivilegesPlugin />, { wrapper });

    const ddiUpdateDropdown = screen.getByTestId(
      `privilege-${MODULES.DDI_PHYSICALINSTANCE}-${PRIVILEGES.UPDATE}`,
    ) as HTMLSelectElement;
    const conceptCreateDropdown = screen.getByTestId(
      `privilege-${MODULES.CONCEPT_CONCEPT}-${PRIVILEGES.CREATE}`,
    ) as HTMLSelectElement;

    fireEvent.change(ddiUpdateDropdown, { target: { value: STRATEGIES.ALL } });
    fireEvent.change(conceptCreateDropdown, {
      target: { value: STRATEGIES.NONE },
    });

    expect(ddiUpdateDropdown.value).toBe(STRATEGIES.ALL);
    expect(conceptCreateDropdown.value).toBe(STRATEGIES.NONE);

    const updatedPrivileges = queryClient.getQueryData(["users"]) as any[];

    const ddiPrivilege = updatedPrivileges.find(
      (p) => p.application === MODULES.DDI_PHYSICALINSTANCE,
    );
    const conceptPrivilege = updatedPrivileges.find(
      (p) => p.application === MODULES.CONCEPT_CONCEPT,
    );

    const ddiUpdatePriv = ddiPrivilege.privileges.find(
      (p: any) => p.privilege === PRIVILEGES.UPDATE,
    );
    const conceptCreatePriv = conceptPrivilege.privileges.find(
      (p: any) => p.privilege === PRIVILEGES.CREATE,
    );

    expect(ddiUpdatePriv.strategy).toBe(STRATEGIES.ALL);
    expect(conceptCreatePriv.strategy).toBe(STRATEGIES.NONE);
  });
});
