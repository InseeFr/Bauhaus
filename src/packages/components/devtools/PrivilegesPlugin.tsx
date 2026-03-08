import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MODULES, PRIVILEGES, STRATEGIES } from "@utils/hooks/rbac-constants";
import type { Privilege, PRIVILEGE } from "@utils/hooks/rbac-constants";

type PrivilegeStrategy = Record<string, Record<string, string>>;

export const PrivilegesPlugin = () => {
  const queryClient = useQueryClient();
  const currentPrivileges = queryClient.getQueryData<Privilege[]>(["users"]);

  const [privilegeStrategies, setPrivilegeStrategies] = useState<PrivilegeStrategy>(() => {
    const initial: PrivilegeStrategy = {};
    Object.values(MODULES).forEach((module) => {
      initial[module] = {};
      const modulePrivilege = currentPrivileges?.find((p) => p.application === module);

      Object.values(PRIVILEGES).forEach((privilege) => {
        const priv = modulePrivilege?.privileges.find((p) => p.privilege === privilege);
        initial[module][privilege] = priv?.strategy || STRATEGIES.NONE;
      });
    });
    return initial;
  });

  useEffect(() => {
    const newPrivileges: Privilege[] = Object.entries(privilegeStrategies).map(
      ([module, privileges]) => ({
        application: module as (typeof MODULES)[keyof typeof MODULES],
        privileges: Object.entries(privileges).map(([privilege, strategy]) => ({
          privilege: privilege as PRIVILEGE,
          strategy: strategy as (typeof STRATEGIES)[keyof typeof STRATEGIES],
        })),
      }),
    );

    queryClient.setQueryData(["users"], newPrivileges);
  }, [privilegeStrategies, queryClient]);

  const handleStrategyChange = (module: string, privilege: string, strategy: string) => {
    setPrivilegeStrategies((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [privilege]: strategy,
      },
    }));
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Privileges Override (DevTools)</h2>
      <p style={{ color: "#666", fontSize: "0.9em", marginBottom: "1rem" }}>
        Override user privileges for testing purposes. Changes are temporary and only affect the
        current session.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxHeight: "600px",
          overflowY: "auto",
        }}
      >
        {Object.values(MODULES).map((module) => (
          <div
            key={module}
            style={{
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "#fafafa",
            }}
          >
            <h3
              style={{
                margin: "0 0 0.75rem 0",
                fontSize: "0.95em",
                fontWeight: "600",
              }}
            >
              {module}
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {Object.values(PRIVILEGES).map((privilege) => (
                <div
                  key={`${module}-${privilege}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <label
                    htmlFor={`privilege-${module}-${privilege}`}
                    style={{
                      fontWeight: "500",
                      fontSize: "0.85em",
                      color: "#555",
                    }}
                  >
                    {privilege}
                  </label>
                  <select
                    id={`privilege-${module}-${privilege}`}
                    data-testid={`privilege-${module}-${privilege}`}
                    value={privilegeStrategies[module]?.[privilege] || "NONE"}
                    onChange={(e) => handleStrategyChange(module, privilege, e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      border: "1px solid #ced4da",
                      backgroundColor: "#fff",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                    }}
                  >
                    <option value="ALL">ALL</option>
                    <option value="NONE">NONE</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "1rem",
          padding: "0.75rem",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px",
          fontSize: "0.85em",
        }}
      >
        <strong>Note:</strong> These changes only affect the current browser session and will be
        reset on page reload.
      </div>
    </div>
  );
};
