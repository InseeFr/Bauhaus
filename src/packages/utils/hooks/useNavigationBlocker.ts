import { useCallback, useEffect } from "react";
import { useBlocker } from "react-router-dom";

export interface UseNavigationBlockerOptions {
  shouldBlock: boolean;
  onBlock?: (proceed: () => void, reset: () => void) => void;
}

/**
 * Hook that blocks navigation when there are unsaved changes.
 * Combines React Router's useBlocker for internal navigation (link clicks, navigate calls)
 * and the browser's beforeunload event for external navigation (F5 refresh, closing tab, external URLs).
 *
 * Note: For browser events (F5, close tab), modern browsers display a generic message
 * like "Changes you made may not be saved" for security reasons. Custom messages
 * passed to onBlock are only shown for internal React Router navigation.
 */
export function useNavigationBlocker({ shouldBlock, onBlock }: UseNavigationBlockerOptions) {
  // Block internal navigation using React Router
  const blocker = useBlocker(shouldBlock);

  // Memoize proceed and reset callbacks to avoid unnecessary re-renders
  const proceed = useCallback(() => blocker.proceed(), [blocker]);
  const reset = useCallback(() => blocker.reset(), [blocker]);

  // Handle internal navigation blocking
  useEffect(() => {
    if (blocker.state === "blocked" && onBlock) {
      onBlock(proceed, reset);
    }
  }, [blocker.state, onBlock, proceed, reset]);

  // Handle browser events (F5, close tab, external navigation)
  // Note: The beforeunload event shows a browser-native dialog with a generic message.
  // Custom messages are ignored by modern browsers for security/anti-abuse reasons.
  useEffect(() => {
    if (!shouldBlock) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // returnValue must be set for the dialog to appear in most browsers
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldBlock]);

  return blocker;
}
